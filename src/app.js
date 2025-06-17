const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("../src/routes/");
const responseHandler = require("../src/utils/responseMiddleware");
const errorHandler = require("../src/utils/errorMiddleware");
const cookieParser = require("cookie-parser");

// const isProduction = process.env.NODE_ENV === 'production';

dotenv.config();

const app = express();
// CORS middleware (for all requests)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // use a specific origin in production
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Support URL-encoded bodies
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://mowara.dcclogsuite.com",
      "http://crms.dcctz.com:81",
      "http://192.168.29.127:3000",
      "http://localhost:3000",
      "http://192.168.29.55:3000",
      "http://10.160.5.101:3000",
    ], // Replace with your frontend URL
    methods: ["GET","PUT","POST","DElETE","PATCH","OPTIONS"],
    credentials: true, // Allow cookies to be sent
  })
);

app.use(responseHandler);
app.use("/uploads", express.static("uploads"));
app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
