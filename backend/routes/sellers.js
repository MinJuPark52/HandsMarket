const express = require("express");
const router = express.Router();
const {
  createSeller,
  getSellerById,
  updateSeller,
  deleteSeller,
} = require("../controllers/sellers");
const upload = require("../middlewares/upload");

router.post("/", upload.single("profileImage"), createSeller);
router.get("/:id", getSellerById);
router.patch("/:id", upload.single("profileImage"), updateSeller);
router.delete("/:id", deleteSeller);

module.exports = router;
