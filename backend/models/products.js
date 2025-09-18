// 전체 상품 조회 (옵션 필터링 포함)
async function findAllProducts(pool, { seller_id, category_id, home, best }) {
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (seller_id) {
    query += " AND seller_id = ?";
    params.push(seller_id);
  }

  if (category_id) {
    query += " AND category_id = ?";
    params.push(category_id);
  }

  if (home) {
    query += " AND is_recommended = ?";
    params.push(true);
  }

  if (best) {
    query += " ORDER BY view_count DESC";
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

// 상품 상세 조회
async function findProductById(pool, product_id) {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE product_id = ?",
    [product_id]
  );
  return rows[0];
}

// 상품 생성
async function insertProduct(
  pool,
  { seller_id, category_id, product_name, price, options }
) {
  const [result] = await pool.query(
    "INSERT INTO products (seller_id, category_id, product_name, price, options) VALUES (?, ?, ?, ?, ?)",
    [seller_id, category_id, product_name, price, JSON.stringify(options)]
  );
  return result.insertId;
}

// 상품 수정
async function modifyProduct(
  pool,
  product_id,
  { product_name, price, category_id, options }
) {
  const fields = [];
  const values = [];

  if (product_name !== undefined) {
    fields.push("product_name = ?");
    values.push(product_name);
  }

  if (price !== undefined) {
    fields.push("price = ?");
    values.push(price);
  }

  if (category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(category_id);
  }

  if (options !== undefined) {
    fields.push("options = ?");
    values.push(JSON.stringify(options));
  }

  if (fields.length === 0) return false;

  values.push(product_id);

  const query = `UPDATE products SET ${fields.join(", ")} WHERE product_id = ?`;
  const [result] = await pool.query(query, values);

  return result.affectedRows > 0;
}

// 상품 삭제
async function removeProduct(pool, product_id) {
  const [result] = await pool.query(
    "DELETE FROM products WHERE product_id = ?",
    [product_id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  findAllProducts,
  findProductById,
  insertProduct,
  modifyProduct,
  removeProduct,
};
