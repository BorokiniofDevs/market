const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/database");

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "cart",
  }
);

module.exports = Cart;
