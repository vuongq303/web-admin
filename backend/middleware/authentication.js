const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/env");

function authentication(req, res, next) {
  const token = req.cookies.TOKEN;
  if (!token) return res.status(401).json({ response: "Token không hợp lệ", status: false });

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded;
    req.isAdmin = [3, 4, 5].includes(decoded.phan_quyen);
    req.isCskh = [2, 3, 4, 5].includes(decoded.phan_quyen);
    req.isSale = [1, 3, 4, 5].includes(decoded.phan_quyen);
    req.Qlns = [0, 3, 4, 5].includes(decoded.phan_quyen);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ response: "Phiên đăng nhập đã hết hạn", status: false });
  }
}

module.exports = authentication;
