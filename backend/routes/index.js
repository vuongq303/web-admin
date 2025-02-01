var express = require("express");
const authentication = require("../middleware/authentication");
const executeQuery = require("../sql/promise");
const config = require("../config/config");
const jsonwebtoken = require("jsonwebtoken");
const env = require("../config/env");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: 200 });
});

router.get("/phan-quyen", authentication, function (req, res) {
  try {
    const user = req.user;
    res.status(200).json({ ...user, status: true });
  } catch (error) {
    console.error("/phan-quyen" + error.message);
    res.status(500).json({ status: false });
  }
});

router.post('/auth', async function (req, res) {
  try {
    const { api_key } = req.body;
    const user = jsonwebtoken.verify(api_key, env.JWT_KEY);
    const sql = "SELECT id FROM nguoi_dung WHERE tai_khoan = ? AND trang_thai = ?";
    const result = await executeQuery(sql, [user.tai_khoan, config.dangLamViec]);

    if (result.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Đăng nhập thành công'
      })
    }
    res.status(200).json({
      status: false,
      message: 'Đăng nhập không thành công'
    })
  } catch (error) {
    console.error('/auth', error.message);
    res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi'
    });
  }
});

module.exports = router;
