const Product = require("../model/product");

exports.getCreateProduct = (req, res, next) => {
  res.render("admin/create-product", {
    pageTitle: "Create Product",
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
      console.log(result);
      res.redirect("/shop/shop");
    })
    .catch((err) => console.log(err));
};
