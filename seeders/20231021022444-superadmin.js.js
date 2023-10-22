const { User } = require("../models")
;("use strict")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          name: "Nur",
          age: 19,
          address: "Jl. Soekarno Hatta no.159",
          role: "superadmin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Ali",
          age: 20,
          address: "Jl. Moehamad Yamin no.57",
          role: "superadmin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Rajab",
          age: 21,
          address: "Jl. Jendral Sudirman no.17",
          role: "superadmin",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true }
    ).then(function (newSuperadmin) {
      const saltRounds = 10
      return queryInterface.bulkInsert("Auths", [
        {
          email: "nur@gmail.com",
          password:
            "$2a$12$q0EAy/6b0Lg5pNIX5b5sseJR6G76PWI8vRHP4l9WPnkaGL/AgU4su",
          userId: newSuperadmin[0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: "ali@gmail.com",
          password:
            "$2a$12$JqOPln.9vdZ2lCkCrhZtg.lKDZi8khJefuJeC3kT15E/Y8k62U3xG",
          userId: newSuperadmin[1].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: "rajab@gmail.com",
          password:
            "$2a$12$LsdHJd67X/s7aBidNC76m.MC39Y3Jk3Fd8VmJQhceCY3GLInBon6.",
          userId: newSuperadmin[2].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  }
}
