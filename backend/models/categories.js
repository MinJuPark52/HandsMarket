async function getAllCategories(pool) {
  const [rows] = await pool.query(`
  SELECT category_id AS id, category_name AS name 
  FROM categories
`);
  return rows;
}

async function createCategory(pool, name) {
  const [result] = await pool.query(
    "INSERT INTO categories (category_name) VALUES (?)",
    [name]
  );
  return result.insertId;
}

async function updateCategory(pool, category_id, name) {
  const [result] = await pool.query(
    "UPDATE categories SET (category_name) = ? WHERE category_id = ?",
    [name, category_id]
  );
  return result.affectedRows;
}

async function deleteCategory(pool, category_id) {
  const [result] = await pool.query(
    "DELETE FROM categories WHERE category_id = ?",
    [category_id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
