const router = require("express").Router()

const { User } = require("../models")
const user = require("../controller/userController")

const autentikasi = require("../middlewares/authenticate")
const checkRoleSuperadmin = require("../middlewares/checkRoleSuperadmin")
const checkId = require("../middlewares/checkId")

router.get("/", user.findUsers)
router.get("/:id", checkId(User), user.findUserById)
router.patch(
  "/update/:id",
  checkId(User),
  autentikasi,
  checkRoleSuperadmin("superadmin"),
  user.updateUser
)
router.delete(
  "/delete/:id",
  checkId(User),
  autentikasi,
  checkRoleSuperadmin("superadmin"),
  user.deleteUser
)

module.exports = router
