var express = require("express");
var router = express.Router();
var connect = require("../bin/connect");

router.get("/", function (req, res) {
  connect.query(
    "SELECT * FROM khach_hang_nguon",
    function (err, result, fields) {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

router.post("/them-khach-hang", function (req, res) {
  const { ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu } = req.body;
  const sql = `
    INSERT INTO khach_hang_nguon (ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu) 
    VALUES (?, ?, ?, ?)`;

  connect.query(
    sql,
    [ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu],
    (error, results) => {
      if (error) {
        return res.status(200).json({ response: error.message, type: false });
      }
      return res
        .status(200)
        .json({ response: "Thêm khách hàng thành công", type: true });
    }
  );
});

router.post("/cap-nhat-khach-hang", function (req, res) {
  const { ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, id } = req.body;

  const sql = `
    update khach_hang_nguon set ten_khach_hang = ? ,
    so_dien_thoai = ?,
    khach_goi_tu = ?,
    ghi_chu = ? where id = ?`;

  connect.query(
    sql,
    [ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, id],
    (error, results) => {
      if (error) {
        return res.status(200).json({ response: error.message, type: false });
      }
      return res
        .status(200)
        .json({ response: "Cập nhật khách hàng thành công", type: true });
    }
  );
});

module.exports = router;
