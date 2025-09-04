const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/auth");

const {
  login,
  signup,
  userProfile,
  updateUser,
  myProfile,
} = require("../controllers/users");
const { validateSignup, validateLogin } = require("../middlewares/users");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/me", authToken, myProfile);
router.get("/:user_id", authToken, userProfile);
router.patch("/:user_id", authToken, updateUser);

module.exports = router;
