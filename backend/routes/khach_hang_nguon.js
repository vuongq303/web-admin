var express = require("express");
var router = express.Router();
const executeQuery = require("../helper/sql_promise");
const authentication = require("../middleware/authentication");

router.get("/", authentication, async function (req, res) {
  try {
    const result = await executeQuery("SELECT * FROM khach_hang_nguon");
    res.status(200).send({ status: true, data: result });
  } catch (error) {
    console.error("/khach-hang-nguon" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-khach-hang", authentication, async function (req, res) {
  try {
    const { ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, ngay_phat_sinh } = req.body;
    const sql = `INSERT INTO khach_hang_nguon
    (ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, ngay_phat_sinh) 
    VALUES (?, ?, ?, ?, ?)`;

    const result = await executeQuery(sql, [ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, ngay_phat_sinh]);
    res.status(200).json({
      response: "Thêm khách hàng thành công ",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-khach-hang" + error.message);
    res.status(500).json({
      response: "Lỗi thêm khách hàng",
      status: false,
    });
  }
});

router.post("/cap-nhat-khach-hang", authentication, async function (req, res) {
  try {
    const { ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, ngay_phat_sinh, id } = req.body;

    const sql = `
    UPDATE khach_hang_nguon SET ten_khach_hang = ? ,
    so_dien_thoai = ?,
    khach_goi_tu = ?,
    ghi_chu = ?,ngay_phat_sinh = ? WHERE id = ?`;

    await executeQuery(sql, [ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, ngay_phat_sinh, id]);
    res.status(200).json({
      response: "Cập nhật khách hàng thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-khach-hang" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật khách hàng thành công",
      status: false,
    });
  }
});

module.exports = router;
