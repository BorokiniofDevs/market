const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/database");

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "orderItem",
  }
);

module.exports = OrderItem;
