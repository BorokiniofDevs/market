const express = require("express");

const shopController = require("../controller/shop");

const router = express.Router();

router.get("/shop", shopController.getProducts);
router.get("/", shopController.getHomePage);

module.exports = router;
