// 로그인
async function findUserByEmail(pool, email) {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, role, password_hash FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
}

async function findUserById(pool, userId) {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
    [userId]
  );
  return rows[0];
}

// 회원가입
async function createUser(pool, email, password_hash, name) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, password_hash, name]
  );
  return result.insertId;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
