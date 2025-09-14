const fs = require("fs");
const path = require("path");
const {
  insertImage,
  getImagesByProductId,
  deleteImageById,
} = require("../models/productImages");
const { uploadToS3, deleteFromS3 } = require("../Images/S3");

async function uploadImage(req, res, next) {
  try {
    const pool = req.pool;
    const { product_id } = req.body;

    if (!product_id)
      return res.status(400).json({ message: "product_id required" });

    const thumbnailFile = req.files["thumbnail"]?.[0];
    const imageFile = req.files["image"]?.[0];

    if (!thumbnailFile || !imageFile)
      return res.status(400).json({ message: "Image files are required" });

    const thumbnailS3Url = await uploadToS3(
      thumbnailFile.path,
      `product-images/thumbnails/${thumbnailFile.filename}`,
      thumbnailFile.mimetype
    );
    const imageS3Url = await uploadToS3(
      imageFile.path,
      `product-images/images/${imageFile.filename}`,
      imageFile.mimetype
    );

    fs.unlinkSync(thumbnailFile.path);
    fs.unlinkSync(imageFile.path);

    const image_id = await insertImage(
      pool,
      product_id,
      thumbnailS3Url,
      imageS3Url
    );

    res.status(201).json({ message: "Image uploaded", image_id });
  } catch (error) {
    next(error);
  }
}

async function getImages(req, res, next) {
  try {
    const pool = req.pool;
    const { product_id } = req.params;

    const images = await getImagesByProductId(pool, product_id);

    res.json(images);
  } catch (error) {
    next(error);
  }
}

function getKeyFromUrl(url) {
  return url.split(".amazonaws.com/")[1];
}

async function deleteImage(req, res, next) {
  try {
    const pool = req.pool;
    const { image_id } = req.params;

    const fileInfo = await deleteImageById(pool, image_id);

    if (fileInfo) {
      [fileInfo.thumbnail, fileInfo.image].forEach((file) => {
        const filePath = path.join(__dirname, "../uploads", file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      const thumbnailKey = getKeyFromUrl(fileInfo.thumbnail);
      const imageKey = getKeyFromUrl(fileInfo.image);

      await deleteFromS3(thumbnailKey);
      await deleteFromS3(imageKey);
    }

    res.json({ message: "Image deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
};
