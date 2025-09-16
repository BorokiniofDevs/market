const express = require("express");

const adminController = require("../controller/admin");

const router = express.Router();

router.get("/create-product", adminController.getCreateProduct);
router.post("/create-product", adminController.postCreateProduct);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/edit-product", adminController.postEditProduct);

module.exports = router;
