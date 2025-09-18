const express = require("express");
const router = express.Router();

const { getRecommendedProducts } = require("../controllers/recommemd");

router.get("/:product_id", getRecommendedProducts);

module.exports = router;
