const router = require("express").Router()

const Auth = require("../controller/authController")

const autentikasi = require("../middlewares/authenticate")
const checkRole = require("../middlewares/checkRole")

//Endpoint Superadmin
router.post("/login", Auth.login)

//Endpoint Admin
router.post(
  "/admin/register",
  autentikasi,
  checkRole("superadmin"),
  Auth.register
)
router.post("/admin/login", Auth.login)

//Endpoint Member
router.post("/member/register", Auth.register)
router.post("/member/login", Auth.login)

router.get("/", autentikasi, Auth.checkToken)

module.exports = router
