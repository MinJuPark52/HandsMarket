const {
  getAllCategories,
  createCategory: createCategoryModel,
  updateCategory: updateCategoryModel,
  deleteCategory: deleteCategoryModel,
} = require("../models/categories");

async function getCategories(req, res, next) {
  try {
    const { category_id, best, home } = req.query;
    const categories = await getAllCategories(req.pool);

    if (best) {
      const [bestProducts] = await req.pool.query(
        "SELECT * FROM products ORDER BY view_count DESC LIMIT 10"
      );
      return res.json(bestProducts);
    }

    if (home) {
      const [homeProducts] = await req.pool.query(
        "SELECT * FROM products ORDER BY created_at DESC LIMIT 10"
      );
      return res.json(homeProducts);
    }

    if (category_id) {
      const [products] = await req.pool.query(
        "SELECT * FROM products WHERE category_id = ?",
        [category_id]
      );
      return res.json(products);
    }

    const categoriesWithProducts = [];

    for (const category of categories) {
      const [products] = await req.pool.query(
        "SELECT * FROM products WHERE category_id = ?",
        [category_id]
      );
      categoriesWithProducts.push({
        id: category.category_id,
        name: category.name,
        products: products,
      });
    }

    res.json(categoriesWithProducts);
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });

    const categoryId = await createCategoryModel(req.pool, name);
    res.status(201).json({ message: "Category created", categoryId });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { category_id } = req.params;
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });

    const affectedRows = await updateCategoryModel(req.pool, category_id, name);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated" });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { category_id } = req.params;
    const affectedRows = await deleteCategoryModel(req.pool, category_id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
