var express = require("express");
var router = express.Router();
const ip = require("../config/ipconfig.json");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload_nguoi_dung");
const executeQuery = require("../sql/promise");
const env = require("../env/get_env");

router.get("/", async function (_, res) {
  try {
    const sql = `SELECT id, ho_ten, ngay_bat_dau,
    tai_khoan,gioi_tinh, so_dien_thoai, email,
    ngay_sinh, hinh_anh, trang_thai, phan_quyen
    FROM nguoi_dung`;
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
      const {
        tai_khoan,
        mat_khau,
        ho_ten,
        ngay_bat_dau,
        so_dien_thoai,
        ngay_sinh,
        email,
        phan_quyen,
        gioi_tinh,
        trang_thai,
      } = req.body;

      const jwt_token = req.headers["authorization"];
      const data = jwt.verify(jwt_token, env.JWT_KEY);

      if (phan_quyen === 'Admin') {
        if (data.phan_quyen !== "Admin") {
          return res.status(200).json({ response: "Không thể thêm Admin", type: false })
        }
      }

      const hinh_anh = `http://${ip.ip}:8080/nguoi-dung/${tai_khoan}.png`;

      const sql = `
    INSERT INTO nguoi_dung 
    (ho_ten, ngay_bat_dau, gioi_tinh, so_dien_thoai, email, ngay_sinh, hinh_anh, trang_thai, phan_quyen, tai_khoan, mat_khau) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const result = await executeQuery(sql, [
        ho_ten,
        ngay_bat_dau,
        gioi_tinh,
        so_dien_thoai,
        email,
        ngay_sinh,
        hinh_anh,
        trang_thai,
        phan_quyen,
        tai_khoan,
        mat_khau,
      ]);
      res
        .status(200)
        .json({ response: "Thêm người dùng thành công ", type: true, id: result.insertId });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({});
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
        tai_khoan,
        ngay_bat_dau,
        so_dien_thoai,
        ngay_sinh,
        email,
        phan_quyen,
        gioi_tinh,
        trang_thai,
      } = req.body;

      const hinh_anh = `http://${ip.ip}:8080/nguoi-dung/${tai_khoan}.png`;

      const sql = `
      UPDATE nguoi_dung SET ho_ten =? ,
      ngay_bat_dau = ?, gioi_tinh = ?,
      so_dien_thoai = ?, email = ?,
      ngay_sinh = ?, hinh_anh = ?,
      trang_thai = ?, phan_quyen = ? WHERE id = ?`;
      await executeQuery(sql, [
        ho_ten,
        ngay_bat_dau,
        gioi_tinh,
        so_dien_thoai,
        email,
        ngay_sinh,
        hinh_anh,
        trang_thai,
        phan_quyen,
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
    console.error(error.message);
    res.status(500).json({});
  }
});

module.exports = router;
