require("dotenv").config();

const env = {
  JWT_KEY: process.env.JWT_KEY,
  PORT: process.env.PORT || "8080",
  admin: "Admin",
  nhan_vien: "Nhân viên",
  quan_ly: "Quản lý",
  cskh: "CSKH",
  IP: process.env.IP,
};
module.exports = env;
