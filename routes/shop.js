const express = require("express");

const shopController = require("../controller/shop");

const router = express.Router();

router.get("/shop", shopController.getProducts);
router.get("/product-detail/:productId", shopController.getProductDetail);
router.get("/index", shopController.getProducts);

module.exports = router;
