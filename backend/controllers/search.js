const { searchProductsByName } = require("../models/search");

async function searchProducts(req, res, next) {
  try {
    const keyword = req.query.keyword || "";
    const products = await searchProductsByName(req.pool, keyword);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

module.exports = { searchProducts };
