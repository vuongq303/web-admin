var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const executeQuery = require("../sql/promise");
const env = require("../config/env");
const config = require("../config/config");
const upload = require("../middleware/uploads/nguoi_dung");
const authentication = require("../middleware/authentication");

router.get("/", authentication, async function (req, res) {
  try {
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(401).json({
        status: false,
        response: "Không có quyền truy cập",
      })
    }

    const sql = `SELECT id, ho_ten, ngay_bat_dau,
    tai_khoan,gioi_tinh, so_dien_thoai, email,
    ngay_sinh, trang_thai, phan_quyen
    FROM nguoi_dung ORDER BY trang_thai DESC, phan_quyen ASC`;

    const result = await executeQuery(sql);
    res.status(200).send({
      status: true,
      data: result
    });
  } catch (error) {
    console.error("/nguoi-dung" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-nguoi-dung", upload.single("hinh_anh"), authentication, async function (req, res) {
  try {
    const { tai_khoan, mat_khau, ho_ten, ngay_bat_dau, so_dien_thoai, ngay_sinh, email, phan_quyen, gioi_tinh, trang_thai, } = req.body;

    const checkUser = await executeQuery("SELECT id FROM nguoi_dung WHERE tai_khoan = ?", [tai_khoan]);

    if (checkUser.length > 0) {
      return res.status(200).json({
        response: "Tài khoản đã tồn tại",
        status: false,
      });
    }

    const sql = `INSERT INTO nguoi_dung 
    (ho_ten, ngay_bat_dau, gioi_tinh, so_dien_thoai, email, ngay_sinh, trang_thai, phan_quyen, tai_khoan, mat_khau) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await executeQuery(sql, [ho_ten, ngay_bat_dau, gioi_tinh, so_dien_thoai, email, ngay_sinh, trang_thai, phan_quyen, tai_khoan, mat_khau]);
    res.status(200).json({
      response: "Thêm người dùng thành công",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-nguoi-dung" + error.message);
    res.status(500).json({
      response: "Lỗi thêm người dùng",
      status: false,
    });
  }
}
);

router.post("/cap-nhat-nguoi-dung", upload.single("hinh_anh"), authentication, async function (req, res) {
  try {
    const { id, ho_ten, ngay_bat_dau, so_dien_thoai, ngay_sinh, email, phan_quyen, gioi_tinh, trang_thai, } = req.body;

    const sql = `UPDATE nguoi_dung SET ho_ten = ? ,
      ngay_bat_dau = ?, gioi_tinh = ?,
      so_dien_thoai = ?, email = ?,
      ngay_sinh = ?, trang_thai = ?,
      phan_quyen = ? WHERE id = ?`;
    await executeQuery(sql, [ho_ten, ngay_bat_dau, gioi_tinh, so_dien_thoai, email, ngay_sinh, trang_thai, phan_quyen, id]);
    res.status(200).json({
      response: "Cập nhật người dùng thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-nguoi-dung" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật người dùng",
      status: false,
    });
  }
}
);

router.post("/dang-nhap", async function (req, res) {
  try {
    const { username, password } = req.body;

    const sql = `SELECT tai_khoan, ho_ten, phan_quyen FROM
      nguoi_dung WHERE tai_khoan = ? and mat_khau = ? AND
      trang_thai = '${config.dangLamViec}'`;
    const result = await executeQuery(sql, [username, password]);

    if (result.length > 0) {
      const token = jwt.sign({ ...result[0] }, env.JWT_KEY, { expiresIn: "8h", });

      res.cookie("TOKEN", token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res.status(200).json({
        response: "Đăng nhập thành công",
        status: true,
        role: result[0].phan_quyen,
      });
    }

    res.status(200).json({
      response: "Đăng nhập không thành công",
      status: false,
    });
  } catch (error) {
    console.error("/dang-nhap: " + error.message);
    res.status(500).json({
      response: "Lỗi đăng nhập",
      status: false
    });
  }
});

module.exports = router;
