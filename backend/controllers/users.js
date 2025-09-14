const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadToS3 } = require("../Images/S3");
const SECRET_KEY = process.env.JWT_SECRET;

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

    const payload = { user_id: user.user_id, email: user.email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", user: userData, token });
  } catch (error) {
    next(error);
  }
}

async function signup(req, res, next) {
  const { email, password, name, role } = req.body;

  try {
    const existingUser = await findUserByEmail(req.pool, email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user_id = await createUser(
      req.pool,
      email,
      hashedPassword,
      name,
      role
    );

    res.status(201).json({ message: "Signup successful", user_id });
  } catch (error) {
    next(error);
  }
}

async function userProfile(req, res, next) {
  const { user_id } = req.params;

  try {
    const user = await findUserById(req.pool, user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function myProfile(req, res, next) {
  try {
    const user_id = req.user.user_id;
    const user = await findUserById(req.pool, user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { user_id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await findUserById(req.pool, user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await findUserByEmail(req.pool, email);
      if (existingUser && existingUser.user_id != user_id) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    let hashedPassword = null;
    if (password) {
      const saltRounds = 12;
      hashedPassword = await bcrypt.hash(password, saltRounds);
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
    if (hashedPassword) {
      fields.push("password_hash = ?");
      values.push(hashedPassword);
    }

    if (req.file) {
      const localPath = req.file.path;
      const s3Key = `profile-images/${req.file.filename}`;
      const contentType = req.file.mimetype;

      const s3Url = await uploadToS3(localPath, s3Key, contentType);

      fs.unlinkSync(localPath);

      fields.push("profile_image = ?");
      values.push(s3Url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    values.push(user_id);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
    await req.pool.query(query, values);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, signup, userProfile, updateUser, myProfile };
