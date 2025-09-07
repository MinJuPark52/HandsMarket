const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/auth");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

router.get("/", getCategories);
router.post("/", authToken, createCategory);
router.patch("/:category_id", authToken, updateCategory);
router.delete("/:category_id", authToken, deleteCategory);

module.exports = router;
