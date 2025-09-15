const path = require("path");
const express = require("express");

const rootdir = require("./utils/path");
const sequelize = require("./utils/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");

const Product = require("./model/product");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootdir, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(rootdir, "views"));

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use(errorRoutes);

sequelize
  .sync({
    // force: true,
  })
  .then((result) =>
    app.listen(3001, () => {
      console.log("Your server is starting.");
      console.log(result);
    })
  )
  .catch((err) => console.log(err));
