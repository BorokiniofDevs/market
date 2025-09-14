const path = require("path");
const express = require("express");

const rootdir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootdir, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(rootdir, "views"));

app.use(adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

app.listen(3002, () => {
  console.log("Your server is starting.");
});
