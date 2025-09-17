require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const corsMiddleware = require("./middlewares/cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const sellersRouter = require("./routes/sellers");
const categoriesRouter = require("./routes/categories");
const tagsRouter = require("./routes/tags");
const productsRouter = require("./routes/products");
const productImagesRouter = require("./routes/productImages");
const recommendRouter = require("./routes/recommend");
const searchRouter = require("./routes/search");
const ordersRouter = require("./routes/orders");

const { testConnection } = require("./services/dbTest");
const mysql = require("mysql2/promise");
const app = express();
const port = process.env.PORT || 8080;

// MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// MySQL 연결 테스트
testConnection(pool)
  .then(() => {
    console.log("MySQL connection test passed.");
  })
  .catch((error) => {
    console.error("MySQL connection test failed:", error);
    process.exit(1);
  });

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(corsMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/sellers", sellersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/products", productsRouter);
app.use("/api/productImages", productImagesRouter);
app.use("/api/recommend", recommendRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", ordersRouter);

// React SPA 빌드 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../frontend/build")));

// SPA catch-all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    ...(req.app.get("env") === "development" && { stack: err.stack }),
  });
});

module.exports = app;
