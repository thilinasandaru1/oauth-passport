const router = require("express").Router();

// auth login
router.get("/login", (req, res) => {
  res.render("login");
});
