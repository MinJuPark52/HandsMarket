const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/auth");

const {
  login,
  signup,
  userProfile,
  updateUser,
} = require("../controllers/users");
const { validateSignup, validateLogin } = require("../middlewares/users");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/:userId", authToken, userProfile);
router.patch("/:userId", authToken, updateUser);

module.exports = router;
