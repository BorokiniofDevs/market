const Sequelize = require("sequelize");

const sequelize = new Sequelize("market", "root", "borokini", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
