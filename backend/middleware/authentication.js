const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/env");
const { admin, quanLy, cskh, sale } = require("../config/config");

function authentication(req, res, next) {
  const token = req.cookies.TOKEN;
  if (!token) return res.status(401).json({ response: "Token không hợp lệ", status: false });

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded;
    req.isAdmin = [admin, quanLy].includes(decoded.phan_quyen);
    req.isCskh = [admin, quanLy, cskh].includes(decoded.phan_quyen);
    req.isSale = [admin, quanLy, sale].includes(decoded.phan_quyen);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ response: "Phiên đăng nhập đã hết hạn", status: false });
  }
}

module.exports = authentication;
