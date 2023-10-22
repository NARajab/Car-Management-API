"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ActivityLog.belongsTo(models.Car, {
        foreignKey: {
          name: "carId",
          allowNull: false
        }
      })
      ActivityLog.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false
        }
      })
    }
  }
  ActivityLog.init(
    {
      username: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      carId: DataTypes.INTEGER,
      action: DataTypes.ENUM(["createdBy", "updatedBy", "deletedBy"]),
      timestamp: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "ActivityLog"
    }
  )
  return ActivityLog
}
