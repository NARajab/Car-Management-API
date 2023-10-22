const { User } = require("../models")
const ApiError = require("../utils/apiError")
const Sequelize = require("sequelize")
const Op = Sequelize.Op

const findUsers = async (req, res, next) => {
  try {
    const user = await User.findAll({
      include: ["Auth"]
    })

    res.status(200).json({
      status: "Succes",
      data: {
        user
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const findUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      },
      include: ["Auth"]
    })

    res.status(200).json({
      status: "Succes",
      data: {
        user
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const updateUser = async (req, res, next) => {
  const { name, age, address } = req.body
  try {
    const existingUser = await User.findOne({
      where: {
        name: name,
        id: { [Op.not]: req.params.id }
      }
    })

    if (existingUser) {
      return next(new ApiError("Name already taken", 400))
    }
    const user = await User.update(
      {
        name,
        age,
        address
      },
      {
        where: {
          id: req.params.id
        }
      }
    )

    res.status(200).json({
      status: "Succes",
      message: "Updated successfully"
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    })

    if (!user) {
      return next(new ApiError("The user with this ID was not found", 404))
    }

    await User.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json({
      status: "Success",
      message: "Deleted successfully"
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser
}
