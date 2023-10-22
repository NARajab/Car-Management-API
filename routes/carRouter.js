const router = require("express").Router()

const { Car } = require("../models")

const car = require("../controller/carController")

const upload = require("../middlewares/uploader")
const checkId = require("../middlewares/checkId")
const autentikasi = require("../middlewares/authenticate")
const checkRole = require("../middlewares/checkRole")

//Endpoint untuk melihat daftar mobil yang tersedia.
router.get("/allcars", car.findCars)

//Endpoint Superadmin dan Admin
router.post(
  "/create",
  autentikasi,
  checkRole("superadmin", "admin"),
  upload.single("image"),
  car.createCar
)
router.get("/", autentikasi, checkRole("superadmin", "admin"), car.findCars)
router.get(
  "/:id",
  checkId(Car),
  autentikasi,
  checkRole("superadmin", "admin"),
  car.findCarById
)
router.patch(
  "/update/:id",
  checkId(Car),
  autentikasi,
  checkRole("superadmin", "admin"),
  upload.single("image"),
  car.updateCar
)
router.delete(
  "/delete/:id",
  checkId(Car),
  autentikasi,
  checkRole("superadmin", "admin"),
  car.deleteCar
)

module.exports = router
