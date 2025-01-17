var express = require("express");
var router = express.Router();
const executeQuery = require("../sql/promise");
const config = require("../config/config");
const authentication = require("../middleware/authentication");

router.get("/", authentication, async function (req, res) {
  try {
    const data = req.user;

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
    res.status(500).send([]);
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
      ngay_sinh,
      phi_moi_gioi,
    } = req.body;
    const sql = `
      INSERT INTO khach_hang (ten_khach_hang, so_dien_thoai, loai_giao_dich, ngay_ki_hop_dong, ghi_chu,
      ma_can_ho, ho_ten_chu_nha, so_dien_thoai_chu_nha, ngay_sinh, phi_moi_gioi) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await executeQuery(sql, [
      ten_khach_hang,
      so_dien_thoai,
      loai_giao_dich,
      ngay_ki_hop_dong,
      ghi_chu,
      ma_can_ho,
      ho_ten_chu_nha,
      so_dien_thoai_chu_nha,
      ngay_sinh,
      phi_moi_gioi,
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
      ngay_sinh,
      phi_moi_gioi,
      id,
    } = req.body;

    const sql = `
    UPDATE khach_hang SET ten_khach_hang = ? ,
    so_dien_thoai = ?,
    loai_giao_dich = ?, ngay_ki_hop_dong = ?,
    ghi_chu = ?, ma_can_ho = ?, ho_ten_chu_nha = ?,
    so_dien_thoai_chu_nha = ?, ngay_sinh = ?,
    phi_moi_gioi = ? WHERE id = ?`;

    await executeQuery(sql, [
      ten_khach_hang,
      so_dien_thoai,
      loai_giao_dich,
      ngay_ki_hop_dong,
      ghi_chu,
      ma_can_ho,
      ho_ten_chu_nha,
      so_dien_thoai_chu_nha,
      ngay_sinh,
      phi_moi_gioi,
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

router.get("/tim-kiem", async (req, res) => {
  try {
    const { phi_moi_gioi, ngay_bat_dau, ngay_ket_thuc } = req.query;
    var sql = "SELECT * FROM khach_hang";
    var condition = [];
    var value = [];

    if (phi_moi_gioi !== "") {
      condition.push("phi_moi_gioi = ?");
      value.push(phi_moi_gioi);
    }

    if (ngay_bat_dau !== "" && ngay_ket_thuc !== "") {
      condition.push("ngay_sinh BETWEEN ? AND ?");
      value.push(...[ngay_bat_dau, ngay_ket_thuc]);
    }

    if (condition.length !== 0) {
      const data = condition.join(" and ");
      sql += ` WHERE ${data}`;
    }
    const result = await executeQuery(sql, value);

    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json([]);
  }
});

module.exports = router;
