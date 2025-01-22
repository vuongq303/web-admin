var mysql = require("mysql");
const env = require("../config/env");

var connect = mysql.createPool({
  host: env.HOSTNAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT,
  database: env.DATABASE,
});

module.exports = connect;
