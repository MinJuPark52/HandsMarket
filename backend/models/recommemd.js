async function findRecommendedProducts(pool, category_id, product_id) {
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM products 
    WHERE category_id = ? 
      AND product_id != ? 
    ORDER BY RAND() 
    LIMIT 5
    `,
    [category_id, product_id]
  );
  return rows;
}

module.exports = {
  findRecommendedProducts,
};
