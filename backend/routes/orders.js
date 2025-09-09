const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/auth");
const { makeOrder, paymentComplete } = require("../controllers/orders");

router.post("/", authToken, makeOrder);
router.post("/complete", paymentComplete);

module.exports = router;
