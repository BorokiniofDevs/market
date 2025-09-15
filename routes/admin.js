const express = require("express");

const adminController = require("../controller/admin");

const router = express.Router();

router.get("/create-product", adminController.getCreateProduct);
router.post("/create-product", adminController.postCreateProduct);

module.exports = router;
