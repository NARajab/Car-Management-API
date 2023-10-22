const ApiError = require("../utils/apiError")

const checkRole = (role, role2) => {
  return async (req, res, next) => {
    try {
      if (req.user.role == role || req.user.role == role2) {
        next()
      } else {
        next(
          new ApiError(
            `cannot access because you're not an superadmin or admin`,
            401
          )
        )
      }
    } catch (err) {
      next(new ApiError(err.message, 500))
    }
  }
}

module.exports = checkRole
