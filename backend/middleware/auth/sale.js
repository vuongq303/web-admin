const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const config = require("../../config/config");

function authentication(req, res, next) {
    const token = req.cookies.TOKEN;

    if (!token) {
        return res.status(401).json({
            response: "Token không hợp lệ",
            status: false,
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_KEY);
        const isSale = decoded.phan_quyen === config.admin || decoded.phan_quyen === config.quanLy || decoded.phan_quyen === config.sale;

        if (!isSale) {
            return res.status(401).json({
                response: "Không thể thực hiện",
                status: false
            });
        }

        req.user = decoded;
        req.isSale = isSale;
        next();
    } catch (error) {
        res.status(401).json({
            response: "Phiên đăng nhập đã hết hạn",
            status: false,
        });
    }
}

module.exports = authentication;
