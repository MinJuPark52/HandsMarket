var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const mysql = require("mysql2/promise");

var app = express();

var port = process.env.PORT || 3000;

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "parkminju00",
  database: "handsmarket",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 미들웨어로 pool을 req에 붙여서 라우터에서 접근 가능하게 할 수도 있어요.
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
