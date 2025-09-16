const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/database");

class CartItem extends Model {}

CartItem.init(
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
    modelName: "cartItem",
  }
);

module.exports = CartItem;
