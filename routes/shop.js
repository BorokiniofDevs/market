const express = require("express");

const shopController = require("../controller/shop");

const router = express.Router();

router.get("/home", shopController.getProducts);
router.get("/product-detail/:productId", shopController.getProductDetail);
router.get("/index", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postToCart);

module.exports = router;
