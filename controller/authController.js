const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { Auth, User } = require("../models")
const ApiError = require("../utils/apiError")

const register = async (req, res, next) => {
  try {
    const { name, email, password, age, address } = req.body

    const user = await Auth.findOne({
      where: {
        email
      }
    })

    if (user) next(new ApiError("User email alrady taken", 400))

    const passwordLength = password <= 8
    if (passwordLength)
      next(new ApiError("Minimum password must be 8 character", 400))

    const saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds)

    if (req.user) {
      if (req.user.role == "superadmin") {
        newUser = await User.create({
          name,
          age,
          address,
          role: "admin"
        })
      }
    } else {
      newUser = await User.create({
        name,
        age,
        address,
        role: "member"
      })
    }
    await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id
    })

    res.status(201).json({
      status: "Success",
      data: {
        ...newUser,
        email,
        password: hashedPassword
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Auth.findOne({
      where: {
        email
      },
      include: ["User"]
    })

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email
        },
        process.env.JWT_SECRET
      )
      res.status(200).json({
        status: "Success",
        message: "Login successful",
        jwt: token
      })
    } else {
      next(new ApiError("Email or password does not match", 401))
    }
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const checkToken = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {
        user: req.user
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

module.exports = {
  register,
  login,
  checkToken
}
