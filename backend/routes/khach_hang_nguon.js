var express = require("express");
var router = express.Router();
const executeQuery = require("../sql/promise");
const config = require("../config/config");
const authentication = require("../middleware/authentication");

router.get("/", authentication, async function (req, res) {
  try {
    const data = req.user;

    if (data.phan_quyen !== config.admin && data.phan_quyen !== config.quanLy) {
      return res.status(401).send([]);
    }

    const result = await executeQuery("SELECT * FROM khach_hang_nguon");
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send([]);
  }
});

router.post("/them-khach-hang", async function (req, res) {
  try {
    const {
      ten_khach_hang,
      so_dien_thoai,
      khach_goi_tu,
      ghi_chu,
      ngay_phat_sinh,
    } = req.body;
    const sql = `
    INSERT INTO khach_hang_nguon (ten_khach_hang, so_dien_thoai, khach_goi_tu, ghi_chu, ngay_phat_sinh) 
    VALUES (?, ?, ?, ?, ?)`;

    const result = await executeQuery(sql, [
      ten_khach_hang,
      so_dien_thoai,
      khach_goi_tu,
      ghi_chu,
      ngay_phat_sinh,
    ]);
    res.status(200).json({
      response: "Thêm khách hàng thành công ",
      type: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({});
  }
});

router.post("/cap-nhat-khach-hang", async function (req, res) {
  try {
    const {
      ten_khach_hang,
      so_dien_thoai,
      khach_goi_tu,
      ghi_chu,
      ngay_phat_sinh,
      id,
    } = req.body;

    const sql = `
    UPDATE khach_hang_nguon SET ten_khach_hang = ? ,
    so_dien_thoai = ?,
    khach_goi_tu = ?,
    ghi_chu = ?,ngay_phat_sinh = ? WHERE id = ?`;

    await executeQuery(sql, [
      ten_khach_hang,
      so_dien_thoai,
      khach_goi_tu,
      ghi_chu,
      ngay_phat_sinh,
      id,
    ]);
    res
      .status(200)
      .json({ response: "Cập nhật khách hàng thành công", type: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({});
  }
});

module.exports = router;
