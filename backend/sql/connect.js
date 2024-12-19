var mysql = require("mysql");
require("dotenv").config();

var host = process.env.HOSTNAME || "";
var user = process.env.USER || "";
var database_name = process.env.DATABASE || "";
var database_port = process.env.DATABASE_PORT || "";

var connect = mysql.createConnection({
  host: host,
  user: user,
  password: "",
  port: database_port,
  database: database_name,
});

module.exports = connect;
