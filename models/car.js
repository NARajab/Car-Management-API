"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.hasOne(models.ActivityLog, {
        foreignKey: {
          name: "carId",
          allowNull: false
        }
      })
    }
  }
  Car.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      category: DataTypes.ENUM(["small", "medium", "large"]),
      dateUpdated: DataTypes.DATE,
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue:
          "https://tse2.mm.bing.net/th?id=OIP.U2iQ7wNK6ZzTW_traW_-PQHaHa&pid=Api&P=0&h=180"
      },
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      deletedBy: DataTypes.INTEGER
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Car"
    }
  )
  return Car
}
