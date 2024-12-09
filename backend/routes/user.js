var express = require("express");
var router = express.Router();
const connect = require("../bin/connect");

router.post("/login", function (req, res) {
  const { username, password } = req.body;

  const sql = "select * from nguoi_dung where tai_khoan = ? and mat_khau = ?";
  const values = [username, password];
  connect.query(sql, values, (err, result) => {
    if (err) {
      return res.status(200).json({
        response: "Đăng nhập không thành công",
        type: false,
        data: {},
      });
    }

    if (result.length > 0) {
      return res
        .status(200)
        .json({
          response: "Đăng nhập thành công",
          type: true,
          data: result[0],
        });
    }

    res
      .status(200)
      .json({ response: "Đăng nhập không thành công", type: false, data: {} });
  });
});

router.post("/new", async function (req, res) {
  const {
    ho_ten,
    ngay_bat_dau,
    gioi_tinh,
    so_dien_thoai,
    email,
    ngay_sinh,
    cccd,
    trang_thai,
    phan_quyen,
  } = req.body;
});

module.exports = router;
