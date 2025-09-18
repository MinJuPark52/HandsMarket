const {
  findAllProducts,
  findProductById,
  insertProduct,
  modifyProduct,
  removeProduct,
} = require("../models/products");

async function getAllProducts(req, res, next) {
  try {
    const { seller_id, category_id, home, best } = req.query;
    const filter = { seller_id, category_id, home, best };
    const products = await findAllProducts(req.pool, filter);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { product_id } = req.params;
    const product = await findProductById(req.pool, product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const seller_id = req.user.user_id;
    const { product_name, price, category_id, options, is_recommended } =
      req.body;

    if (!product_name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProductId = await insertProduct(req.pool, {
      seller_id,
      category_id,
      product_name,
      price,
      options,
      is_recommended,
    });

    res
      .status(201)
      .json({ message: "Product created", product_id: newProductId });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { product_id } = req.params;
    const { product_name, price, category_id, options, is_recommended } =
      req.body;

    const updated = await modifyProduct(req.pool, product_id, {
      product_name,
      price,
      category_id,
      options,
      is_recommended,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { product_id } = req.params;

    const deleted = await removeProduct(req.pool, product_id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
