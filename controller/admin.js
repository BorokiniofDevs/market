const Product = require("../model/product");

exports.getCreateProduct = (req, res, next) => {
  res.render("admin/create-product", {
    pageTitle: "Create Product",
    editing: false,
    product: {},
  });
};
exports.postCreateProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then((result) => {
      console.log("PRODUCT CREATED");
      res.redirect("/shop/index");
    })
    .catch((err) => console.log(err));
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save();
    })
    .then((result) => {
      console.log("PRODUCT UPDATED");
      return res.redirect("/shop/index");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/admin/products");
      }
      res.render("admin/create-product", {
        pageTitle: "Edit " + product.title,
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("PRODUCT DELETED");
      return res.redirect("/shop/shop");
    })
    .catch((err) => {
      console.log(err);
    });
};
