const bcrypt = require("bcrypt");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/users");

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(req.pool, email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password_hash, ...userData } = user;

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    next(error);
  }
}

async function signup(req, res, next) {
  const { email, password, name } = req.body;

  try {
    const existingUser = await findUserByEmail(req.pool, email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const userId = await createUser(req.pool, email, password_hash, name);

    res.status(201).json({ message: "Signup successful", userId });
  } catch (error) {
    next(error);
  }
}

async function userProfile(req, res, next) {
  const { userId } = req.params;

  try {
    const user = await findUserById(req.pool, userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { userId } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await findUserById(req.pool, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      const existingUser = await findUserByEmail(req.pool, email);
      if (existingUser && existingUser.user_id != userId) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    let password_hash = null;
    if (password) {
      const saltRounds = 12;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (password_hash) {
      fields.push("password_hash = ?");
      values.push(password_hash);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    values.push(userId);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
    await req.pool.query(query, values);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, signup, userProfile, updateUser };
