const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const {
  uploadImage,
  getImages,
  deleteImage,
} = require("../controllers/productImages");

router.post(
  "/",
  authToken,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  uploadImage
);
router.get("/:product_id", getImages);
router.delete("/:image_id", authToken, deleteImage);

module.exports = router;
