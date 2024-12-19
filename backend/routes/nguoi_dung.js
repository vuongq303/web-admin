var express = require("express");
var router = express.Router();
var connect = require("../sql/connect");
const ip = require("../config/ipconfig.json");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload_nguoi_dung");
const executeQuery = require("../sql/promise");
const JWT_KEY =
  process.env.JWT_KEY || "8jjfafw8*&njlnfaJHf9*72nnklfooeujvOOJNyb)()?6%12";

router.get("/", async function (_, res) {
  const sql = "SELECT * FROM nguoi_dung";
  try {
    const result = await executeQuery(sql);
    res.status(200).send(result);
  } catch (error) {
    console.error("/nguoi-dung/ ", error.message);
    res.status(500).send([]);
  }
});

router.post(
  "/them-nguoi-dung",
  upload.single("hinh_anh"),
  async function (req, res) {
    try {
      const file = req.file;
      const {
        tai_khoan,
        mat_khau,
        ho_ten,
        ngay_bat_dau,
        so_dien_thoai,
        ngay_sinh,
        email,
        vi_tri,
        gioi_tinh,
        trang_thai,
      } = req.body;

      if (!file) {
        return res.status(200).json({ response: "Lỗi lưu ảnh", type: false });
      }

      const hinh_anh = `http://${ip.ip}:8080/${req.body.tai_khoan}/${req.body.tai_khoan}.png`;

      const sql = `
  INSERT INTO nguoi_dung 
  (ho_ten, ngay_bat_dau, gioi_tinh, so_dien_thoai, email, ngay_sinh, hinh_anh, trang_thai, phan_quyen, tai_khoan, mat_khau) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await executeQuery(sql, [
        ho_ten,
        ngay_bat_dau,
        gioi_tinh,
        so_dien_thoai,
        email,
        ngay_sinh,
        hinh_anh,
        trang_thai,
        vi_tri,
        tai_khoan,
        mat_khau,
      ]);
      res
        .status(200)
        .json({ response: "Thêm người dùng thành công ", type: true });
    } catch (error) {
      console.error("/nguoi-dung/them-nguoi-dung", error.message);
      res.status(500).json({ response: "Error", type: false });
    }
  }
);

router.post(
  "/cap-nhat-nguoi-dung",
  upload.single("hinh_anh"),
  async function (req, res) {
    try {
      const {
        id,
        ho_ten,
        ngay_bat_dau,
        so_dien_thoai,
        ngay_sinh,
        email,
        vi_tri,
        gioi_tinh,
        trang_thai,
      } = req.body;

      const hinh_anh = `http://${ip.ip}:8080/${req.body.tai_khoan}/${req.body.tai_khoan}.png`;

      const sql = `
      update nguoi_dung set ho_ten =? ,
      ngay_bat_dau = ?, gioi_tinh = ?,
      so_dien_thoai = ?, email = ?,
      ngay_sinh = ?, hinh_anh = ?,
      trang_thai = ?, phan_quyen = ? where id = ?`;
      await executeQuery(sql, [
        ho_ten,
        ngay_bat_dau,
        gioi_tinh,
        so_dien_thoai,
        email,
        ngay_sinh,
        hinh_anh,
        trang_thai,
        vi_tri,
        id,
      ]);
      res
        .status(200)
        .json({ response: "Cập nhật người dùng thành công", type: true });
    } catch (error) {
      console.error("/nguoi-dung/cap-nhat-nguoi-dung ", error.message);
      res.status(500).json({ response: "Error", type: false });
    }
  }
);

router.post("/dang-nhap", async function (req, res) {
  try {
    const { username, password } = req.body;
    const sql =
      "select tai_khoan, ho_ten, phan_quyen from nguoi_dung where tai_khoan = ? and mat_khau = ?";
    const result = await executeQuery(sql, [username, password]);
    
    if (result.length > 0) {
      return res.status(200).json({
        response: "Đăng nhập thành công",
        type: true,
        data: jwt.sign(JSON.stringify(result[0]), JWT_KEY),
      });
    }

    res.status(200).json({
      response: "Đăng nhập không thành công",
      type: false,
    });
  } catch (error) {
    console.error("/nguoi-dung/dang-nhap ", error.message);
    res.status(500).json({ response: "Error", type: false });
  }
});

module.exports = router;
