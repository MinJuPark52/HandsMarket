const cors = require("cors");

const corsOptions = {
  origin: "https://handsmarket.vercel.app", // 클라이언트 URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
