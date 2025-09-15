const Product = require("../model/product");

exports.getHomePage = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Home",
  });
};

// List / shop page
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop",
        products: products, // NOTE: plural for list view
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/"); // graceful fallback
    });
};

// Single product detail
exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) return res.redirect("/shop");

      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product, // ✅ pass single product
      });
    })
    .catch((err) => console.log(err));
};
