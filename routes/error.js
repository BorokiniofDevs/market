const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.status(404).render("error/404.ejs", {
    pageTitle: "Page Not Found",
  });
});

module.exports = router;
