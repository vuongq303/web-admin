var express = require("express");
var router = express.Router();
const env = require("../env/get_env");
const jwt = require("jsonwebtoken");
const executeQuery = require("../sql/promise");
const config = require("../config/config");

router.get("/", async function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    if (
      data.phan_quyen !== config.admin &&
      data.phan_quyen !== config.quanLy &&
      data.phan_quyen !== config.cskh
    ) {
      return res.status(401).send([]);
    }
    const result = await executeQuery("SELECT * FROM khach_hang");
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({});
  }
});

router.post("/them-khach-hang", async function (req, res) {
  try {
    const {
      ten_khach_hang,
      so_dien_thoai,
      loai_giao_dich,
      ngay_ki_hop_dong,
      ghi_chu,
      ma_can_ho,
      ho_ten_chu_nha,
      so_dien_thoai_chu_nha,
    } = req.body;
    const sql = `
      INSERT INTO khach_hang (ten_khach_hang, so_dien_thoai, loai_giao_dich, ngay_ki_hop_dong, ghi_chu,
      ma_can_ho, ho_ten_chu_nha, so_dien_thoai_chu_nha) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await executeQuery(sql, [
      ten_khach_hang,
      so_dien_thoai,
      loai_giao_dich,
      ngay_ki_hop_dong,
      ghi_chu,
      ma_can_ho,
      ho_ten_chu_nha,
      so_dien_thoai_chu_nha,
    ]);
    res.status(200).json({
      response: "Thêm khách hàng thành công",
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
      loai_giao_dich,
      ngay_ki_hop_dong,
      ghi_chu,
      ma_can_ho,
      ho_ten_chu_nha,
      so_dien_thoai_chu_nha,
      id,
    } = req.body;

    const sql = `
    UPDATE khach_hang SET ten_khach_hang = ? ,
    so_dien_thoai = ?,
    loai_giao_dich = ?, ngay_ki_hop_dong = ?,
    ghi_chu = ?, ma_can_ho = ?, ho_ten_chu_nha = ?,
    so_dien_thoai_chu_nha = ? WHERE id = ?`;

    await executeQuery(sql, [
      ten_khach_hang,
      so_dien_thoai,
      loai_giao_dich,
      ngay_ki_hop_dong,
      ghi_chu,
      ma_can_ho,
      ho_ten_chu_nha,
      so_dien_thoai_chu_nha,
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
