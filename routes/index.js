var express = require("express");
var router = express.Router();
const { signup, login, searchUser } = require("../controllers/userController");
const { validateToken } = require("../helpers/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Chat App" });
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/searchUser", validateToken, searchUser);

module.exports = router;
