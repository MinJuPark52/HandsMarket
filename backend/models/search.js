async function searchProductsByName(pool, keyword) {
  const query = `
    SELECT *
    FROM products
    WHERE product_name LIKE CONCAT('%', ?, '%')
    ORDER BY created_at DESC
    LIMIT 0, 20
  `;
  const [rows] = await pool.query(query, [keyword]);
  return rows;
}

module.exports = { searchProductsByName };
