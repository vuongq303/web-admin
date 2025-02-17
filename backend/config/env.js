require("dotenv").config();

module.exports = {
  JWT_KEY: process.env.JWT_KEY || "",
  PORT: process.env.PORT || 8080,
  HOSTNAME: process.env.HOSTNAME || "localhost",
  DATABASE_USER: process.env.DATABASE_USER || "root",
  DATABASE: process.env.DATABASE || "",
  DATABASE_PORT: process.env.DATABASE_PORT || 3306,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
  MONGODB_KEY: process.env.MONGODB_KEY || "",
};
