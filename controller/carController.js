const { Car, ActivityLog } = require("../models")
const imagekit = require("../lib/imagekit")
const ApiError = require("../utils/apiError")
const Sequelize = require("sequelize")
const Op = Sequelize.Op

const createCar = async (req, res, next) => {
  try {
    const { name, price, category } = req.body
    const car = await Car.findOne({
      where: {
        name
      }
    })
    if (car) {
      return next(new ApiError("Car name has already been taken", 400))
    }
    const file = req.file
    let img
    if (file) {
      // dapatkan extension file nya
      const split = file.originalname.split(".")
      const extension = split[split.length - 1]

      // upload file ke imagekit
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`
      })
      img = uploadedImage.url
    }

    const newCar = await Car.create({
      name,
      price,
      category,
      dateUpdated: new Date(),
      createdBy: req.user.id,
      imageUrl: img
    })

    await ActivityLog.create({
      username: req.user.name,
      userId: req.user.id,
      carId: newCar.id,
      action: "createdBy",
      timestamp: new Date()
    })
    res.status(200).json({
      status: "Success",
      data: {
        newCar
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const findCars = async (req, res, next) => {
  try {
    const { name, category } = req.query

    const condition = {}

    if (name) {
      condition.name = { [Op.iLike]: "%" + name + "%" }
    }
    if (category) {
      condition.category = category
    }

    const cars = await Car.findAll({
      where: condition,
      include: ["ActivityLog"]
    })

    res.status(200).json({
      status: "Success",
      data: {
        cars
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}
const findCarById = async (req, res, next) => {
  try {
    const car = await Car.findOne({
      where: {
        id: req.params.id
      },
      include: ["ActivityLog"]
    })

    if (car === null) {
      return next(new ApiError("Car does not exist", 400))
    }

    res.status(200).json({
      status: "Success",
      data: {
        car
      }
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const updateCar = async (req, res, next) => {
  try {
    const { name, price, category } = req.body
    const car = await Car.findOne({
      where: {
        name
      }
    })
    if (car) {
      return next(new ApiError("Car name has already been taken", 400))
    }
    const file = req.file
    let img
    if (file) {
      // dapatkan extension file nya
      const split = file.originalname.split(".")
      const extension = split[split.length - 1]

      // upload file ke imagekit
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`
      })
      img = uploadedImage.url
    }

    await Car.update(
      {
        name,
        price,
        category,
        dateUpdated: req.date,
        updatedBy: req.user.id,
        imageUrl: img
      },
      {
        where: {
          id: req.params.id
        }
      }
    )

    await ActivityLog.create({
      username: req.user.name,
      userId: req.user.id,
      carId: req.params.id,
      action: "updatedBy",
      timestamp: new Date()
    })

    res.status(200).json({
      status: "Success",
      message: "Updated successfully"
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findOne({
      where: {
        id: req.params.id
      }
    })

    if (!car) {
      return next(new ApiError("The user with this ID was not found", 404))
    }

    await ActivityLog.create({
      username: req.user.name,
      userId: req.user.id,
      carId: car.id,
      action: "deletedBy",
      timestamp: new Date()
    })

    await Car.update(
      {
        deletedBy: req.user.id
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    await Car.destroy({
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
  createCar,
  findCars,
  findCarById,
  updateCar,
  deleteCar
}
