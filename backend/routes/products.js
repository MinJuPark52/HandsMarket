const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/auth");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

router.get("/", getAllProducts);
router.get("/:product_id", getProductById);
router.post("/", authToken, createProduct);
router.patch("/:product_id", authToken, updateProduct);
router.delete("/:product_id", authToken, deleteProduct);

module.exports = router;
