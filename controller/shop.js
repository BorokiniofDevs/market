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

// exports.postReduceCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => cart.getProducts({ where: { id: prodId } }))
//     .then((products) => {
//       const product = product[0];
//       if (!product) return res.redirect("/shop/cart");
//       let oldQuantity = product.cartItem.quantity;
//       if (oldQuantity > 1) {
//         return product.cartItem.update({ quantity: oldQuantity - 1 });
//       } else {
//         return product.cartItem.destroy();
//       }
//     })
//     .then(() => res.redirect("/shop/cart"))
//     .catch((err) => console.log(err));
// };

exports.postReduceCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      updatedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      if (!product) return res.json({ success: false });
      let oldQuantity = product.cartItem.quantity;
      if (oldQuantity > 1) {
        return product.cartItem.update({ quantity: oldQuantity - 1 });
      } else {
        return product.cartItem.destroy();
      }
    })
    .then(() => {
      return updatedCart.getProducts();
    })
    .then((products) => {
      let total = 0,
        count = 0;
      const items = products.map((p) => {
        total += p.price * p.cartItem.quantity;
        count += p.cartItem.quantity;

        return {
          id: p.id,
          title: p.title,
          price: p.price,
          quantity: p.cartItem.quantity,
          subtotal: p.price * p.cartItem.quantity,
        };
      });
      res.json({ success: true, items, total, count });
    })
    .catch((err) => {
      res.json({ success: false, error: err.message });
      console.log(err);
    });
};

// exports.postDeleteCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => cart.getProducts({ where: { id: prodId } }))
//     .then((products) => {
//       const product = products[0];
//       if (!product) return res.redirect("/shop/cart");
//       return product.cartItem.destroy();
//     })
//     .then(() => res.redirect("/shop/cart"))
//     .catch((err) => console.log(err));
// };

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  let updatedCart;

  req.user
    .getCart()
    .then((cart) => {
      updatedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      if (!product) return res.json({ success: false });
      return product.cartItem.destroy();
    })
    .then(() => updatedCart.getProducts())
    .then((products) => {
      let total = 0,
        count = 0;

      const items = products.map((p) => {
        total += p.price * p.cartItem.quantity;
        count += p.cartItem.quantity;

        return {
          id: p.id,
          title: p.title,
          price: p.price,
          quantity: p.cartItem.quantity,
          subtotal: p.price * p.cartItem.quantity,
        };
      });

      res.json({ success: true, items, total, count });
    })
    .catch((err) => {
      res.json({ success: false, error: err.message });
      console.error(err);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((p) => {
            p.orderItem = {
              quantity: p.cartItem.quantity,
            };
            return p;
          })
        );
      });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then(() => res.redirect("/shop/order"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/order", {
        orders: orders,
        pageTitle: "Your Orders",
      });
    })
    .catch((err) => console.log(err));
};
