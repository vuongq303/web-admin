var express = require("express");
var router = express.Router();
var connect = require("../bin/connect");
var multer = require("multer");
const fs = require("fs");
const { join } = require("path");
const ip = require("../config/ipconfig.json");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = join(__dirname, "..", "uploads", req.body.tai_khoan);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.tai_khoan}.png`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get("/", function (req, res, next) {
  connect.query("SELECT * FROM nguoi_dung", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.post("/them-nguoi-dung", upload.single("hinh_anh"), function (req, res) {
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

  connect.query(
    sql,
    [
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
    ],
    (error, results) => {
      if (error) {
        return res.status(200).json({ response: error.message, type: false });
      }
      return res
        .status(200)
        .json({ response: "Thêm người dùng thành công", type: true });
    }
  );
});

router.post(
  "/cap-nhat-nguoi-dung",
  upload.single("hinh_anh"),
  function (req, res) {
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

    connect.query(
      sql,
      [
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
      ],
      (error, results) => {
        if (error) {
          return res.status(200).json({ response: error.message, type: false });
        }
        return res
          .status(200)
          .json({ response: "Cập nhật người dùng thành công", type: true });
      }
    );
   }
);

module.exports = router;
