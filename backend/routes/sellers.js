const express = require("express");
const router = express.Router();
const {
  createSeller,
  getSellerById,
  updateSeller,
  deleteSeller,
} = require("../controllers/sellers");
const upload = require("../middlewares/upload");
const authToken = require("../middlewares/auth");

router.post("/", authToken, upload.single("profileImage"), createSeller);
router.get("/:id", getSellerById);
router.patch("/:id", authToken, upload.single("profileImage"), updateSeller);
router.delete("/:id", deleteSeller);

module.exports = router;
