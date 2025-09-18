async function insertImage(pool, product_id, thumbnail, image) {
  const [result] = await pool.query(
    `INSERT INTO product_images (product_id, thumbnail, image) VALUES (?, ?, ?)`,
    [product_id, thumbnail, image]
  );
  return result.insertId;
}

async function getImagesByProductId(pool, product_id) {
  const [rows] = await pool.query(
    `SELECT * FROM product_images WHERE product_id = ?`,
    [product_id]
  );
  return rows;
}

async function deleteImageById(pool, image_id) {
  const [rows] = await pool.query(
    `SELECT thumbnail, image FROM product_images WHERE image_id = ?`,
    [image_id]
  );

  await pool.query(`DELETE FROM product_images WHERE image_id = ?`, [image_id]);

  return rows[0];
}

module.exports = {
  insertImage,
  getImagesByProductId,
  deleteImageById,
};
