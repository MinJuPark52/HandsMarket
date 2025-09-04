// 판매자 생성
async function createSeller(pool, userId, sellerName, profileImage) {
  const [result] = await pool.query(
    "INSERT INTO sellers (user_id, seller_name, profile_image) VALUES (?, ?, ?)",
    [userId, sellerName, profileImage]
  );
  return {
    seller_id: result.insertId,
    user_id: userId,
    seller_name: sellerName,
    profile_image: profileImage,
  };
}

// 판매자 단일 조회
async function findSellerById(pool, sellerId) {
  const [rows] = await pool.query(
    "SELECT seller_id, user_id, seller_name, profile_image, created_at, updated_at FROM sellers WHERE seller_id = ?",
    [sellerId]
  );
  return rows[0];
}

// 판매자 정보 수정
async function updateSeller(pool, sellerId, updates) {
  const fields = [];
  const values = [];

  for (const key in updates) {
    fields.push(`${key} = ?`);
    values.push(updates[key]);
  }
  values.push(sellerId);

  const sql = `UPDATE sellers SET ${fields.join(", ")} WHERE seller_id = ?`;
  const [result] = await pool.query(sql, values);

  if (result.affectedRows === 0) return null;

  return findSellerById(pool, sellerId);
}

// 판매자 삭제
async function deleteSeller(pool, sellerId) {
  const [result] = await pool.query("DELETE FROM sellers WHERE seller_id = ?", [
    sellerId,
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  createSeller,
  findSellerById,
  updateSeller,
  deleteSeller,
};
