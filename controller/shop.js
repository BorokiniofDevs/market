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
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
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
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

// Load Cart Page
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        cart: products.map((product) => {
          return {
            product: product,
            quantity: product.cartItem.quantity,
          };
        }),
        pageTitle: "Your Cart",
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postToCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/shop/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
