require("dotenv").config();

const env = {
  JWT_KEY:
    process.env.JWT_KEY || "8jjfafw8*&njlnfaJHf9*72nnklfooeujvOOJNyb)()?6%12",
  admin: "Admin",
  nhan_vien: "Nhân viên",
  quan_ly: "Quản lý",
  cskh: "CSKH",
};
module.exports = env;
