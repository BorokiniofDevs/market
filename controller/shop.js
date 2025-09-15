const Product = require("../model/product");

exports.getHomePage = (req, res, next) => {
  res.render("shop/home", {
    pageTitle: "Home",
  });
};
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("shop/shop", {
        pageTitle: "Shop",
        products: products,
        //   path: "/shop",
      })
    )
    .catch((err) => {
      console.log(err);
    });
};
