const { findProductById } = require("../models/products");
const { findRecommendedProducts } = require("../models/recommemd");

async function getRecommendedProducts(req, res, next) {
  try {
    const pool = req.pool;
    const { product_id } = req.params;

    const product = await findProductById(pool, product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const recommended = await findRecommendedProducts(
      pool,
      product.category_id,
      product_id
    );

    res.json(recommended);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecommendedProducts,
};
