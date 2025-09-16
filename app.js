const path = require("path");
const express = require("express");

const rootdir = require("./utils/path");
const sequelize = require("./utils/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/error");

const Product = require("./model/product");
const Cart = require("./model/cart");
const User = require("./model/user");
const CartItem = require("./model/cartItem");
const Order = require("./model/order");
const OrderItem = require("./model/orderItem");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootdir, "public")));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(rootdir, "views"));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  if (!req.user) {
    res.locals.cartCount = 0;
    res.locals.orderCount = 0;
    return next();
  }

  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      // let totalItems = 0;
      // products.forEach((p) => (totalItems += p.cartItem.quantity));
      // res.locals.cartCount = totalItems;
      // next();
      const cartCount = products.reduce(
        (sum, p) => sum + p.cartItem.quantity,
        0
      );
      res.locals.cartCount = cartCount;
      return req.user.getOrders();
    })
    .then((orders) => {
      res.locals.orderCount = orders.length;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.locals.cartCount = 0;
      res.locals.orderCount = 0;
      next();
    });
});

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use(errorRoutes);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync({
    // force: true,
  })
  .then((result) => {
    User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Borokini", email: "text@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) =>
    app.listen(3001, () => {
      console.log("Your server is starting.");
      // console.log(result);
    })
  )
  .catch((err) => console.log(err));
