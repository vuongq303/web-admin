require("dotenv").config();

const env = {
  JWT_KEY:process.env.JWT_KEY,
  admin: "Admin",
  nhan_vien: "Nhân viên",
  quan_ly: "Quản lý",
  cskh: "CSKH",
  IP: process.env.IP,
};
module.exports = env;
