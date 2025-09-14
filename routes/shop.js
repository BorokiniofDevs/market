const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("shop/home", {
    pageTitle: "Home",
  });
});

module.exports = router;
