const mysql = require("mysql2/promise");

const testConnection = async (pool) => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully!");
    connection.release();
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    throw new Error("MySQL connection failed");
  }
};

module.exports = { testConnection };
