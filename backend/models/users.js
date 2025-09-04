// 로그인
async function findUserByEmail(pool, email) {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, role, password_hash FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
}

async function findUserById(pool, user_id) {
  const [rows] = await pool.query(
    "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
    [user_id]
  );
  return rows[0];
}

// 회원가입
async function createUser(pool, email, password_hash, name, role) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
    [email, password_hash, name, role]
  );
  return result.insertId;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
