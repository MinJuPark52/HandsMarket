var express = require("express");
var router = express.Router();

// 모든 유저 조회
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await req.pool.query(
      "SELECT user_id, name, email, role, created_at FROM users"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 특정 유저 조회
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const [rows] = await req.pool.query(
      "SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// 새 유저 생성
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const [result] = await req.pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );
    res.status(201).json({ user_id: result.insertId, message: "User created" });
  } catch (err) {
    next(err);
  }
});

// 유저 정보 수정
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;
    const [result] = await req.pool.query(
      "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE user_id = ?",
      [name, email, password, role, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated" });
  } catch (err) {
    next(err);
  }
});

// 유저 삭제
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const [result] = await req.pool.query(
      "DELETE FROM users WHERE user_id = ?",
      [userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

// 로그인 api
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const [rows] = await req.pool.query(
    "SELECT user_id, name, email, role FROM users WHERE email = ? AND password = ?",
    [email, password]
  );
  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ message: "Login successful", user: rows[0] });
});

module.exports = router;
