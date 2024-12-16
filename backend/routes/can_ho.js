var express = require("express");
var router = express.Router();
const connect = require("../bin/connect");
const upload = require("../middleware/upload_can_ho");
const { join } = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const env = require("../env/get_env");

router.get("/", async function (req, res) {
  const jwt_token = req.headers["authorization"];

  if (!jwt_token) {
    return res.status(401).send("Not allowed");
  }

  const data = jwt.verify(jwt_token, env.JWT_KEY);
  var sql =
    "select id, khach_hang, gia_ban, gia_thue, trang_thai, du_an, dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, hinh_anh, ten_toa_nha, truc_can_ho from can_ho";
  if (data.phan_quyen === "Admin") {
    sql = `select can_ho.*, khach_hang.ten_khach_hang, khach_hang.so_dien_thoai, khach_hang.loai_giao_dich
    from can_ho
    join khach_hang on can_ho.khach_hang =  khach_hang.id`;
  }

  connect.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.status(200).send({ response: result, role: data.phan_quyen });
  });
});

router.post(
  "/them-anh-can-ho",
  upload.array("hinh_anh"),
  async function (req, res) {
    const files = req.files;
    const { id } = req.body;

    if (!files[0]) {
      return res
        .status(200)
        .json({ response: "Lỗi thêm ảnh", type: false, data: "" });
    }

    var filePath = files.map((file) => file.filename);
    const sqlGetHinhAnh = "SELECT hinh_anh FROM can_ho WHERE id = ?";
    const [resultGetHinhAnh] = await executeQuery(sqlGetHinhAnh, [id]);

    var sql = "UPDATE can_ho SET hinh_anh = ? WHERE id = ?";
    var path = filePath.join(",");

    if (resultGetHinhAnh.hinh_anh) {
      const listHinhAnh = resultGetHinhAnh.hinh_anh.split(",");
      const resultHinhAnh = [...filePath, ...listHinhAnh];
      path = resultHinhAnh.join(",");
    }

    try {
      await executeQuery(sql, [path, id]);
      return res
        .status(200)
        .json({ response: "Thêm ảnh thành công", type: true, data: filePath });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: "Lỗi máy chủ, vui lòng thử lại sau", type: false });
    }
  }
);

router.post("/xoa-anh-can-ho", async function (req, res) {
  const { id, filename } = req.body;

  const filePath = join(
    __dirname,
    "..",
    "uploads",
    "can-ho",
    `${id}`,
    filename
  );

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        response: "File not found",
        type: false,
      });
    }

    await fs.promises.unlink(filePath);

    const sqlGetHinhAnh = "SELECT hinh_anh FROM can_ho WHERE id = ?";
    const [resultGetHinhAnh] = await executeQuery(sqlGetHinhAnh, [id]);

    if (resultGetHinhAnh.hinh_anh) {
      const listHinhAnh = resultGetHinhAnh.hinh_anh.split(",");
      const updatedHinhAnh = listHinhAnh
        .filter((item) => item !== filename)
        .join(",");

      await executeQuery("UPDATE can_ho SET hinh_anh = ? WHERE id = ?", [
        updatedHinhAnh,
        id,
      ]);

      return res.status(200).json({
        response: "Xóa ảnh thành công",
        type: true,
        data: updatedHinhAnh.split(","),
      });
    }

    return res.status(400).json({
      response: "Lỗi xóa ảnh, không tìm thấy dữ liệu",
      type: false,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      response: "Lỗi hệ thống",
      type: false,
    });
  }
});

const executeQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    connect.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

router.post("/them-can-ho", async (req, res) => {
  try {
    const {
      ten_khach_hang,
      so_dien_thoai,
      ma_can_ho,
      ten_toa_nha,
      loai_giao_dich,
      ngay_ki_hop_dong,
      ten_du_an,
      dien_tich,
      so_phong_ngu,
      so_phong_tam,
      huong_can_ho,
      loai_can_ho,
      noi_that,
      mo_ta,
      nguoi_cap_nhat,
      gia_ban,
      gia_thue,
      truc_can_ho,
      trang_thai,
    } = req.body;

    const sql =
      "SELECT * FROM can_ho WHERE ma_can_ho = ? and ten_toa_nha = ? and truc_can_ho = ?";
    const checkMaCanHoExist = await executeQuery(sql, [
      ma_can_ho,
      ten_toa_nha,
      truc_can_ho,
    ]);

    if (checkMaCanHoExist.length > 0) {
      return res
        .status(200)
        .json({ response: "Căn hộ đã tồn tại", type: false });
    }

    const sqlKhachHang = `
        INSERT INTO khach_hang 
        (ten_khach_hang, so_dien_thoai, loai_giao_dich, ngay_ki_hop_dong, ghi_chu) 
        VALUES (?, ?, ?, ?, ?)`;
    const khachHangResult = await executeQuery(sqlKhachHang, [
      ten_khach_hang,
      so_dien_thoai,
      loai_giao_dich,
      ngay_ki_hop_dong,
      "Trống",
    ]);
    const idKhachHang = khachHangResult.insertId;

    const sqlCanHo = `
        INSERT INTO can_ho 
        (ma_can_ho, khach_hang, gia_ban, gia_thue, du_an, dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, trang_thai,ten_toa_nha,truc_can_ho) 
        VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?, ?, ?, ?, ?)`;
    await executeQuery(sqlCanHo, [
      ma_can_ho,
      idKhachHang,
      gia_ban,
      gia_thue,
      ten_du_an,
      dien_tich,
      so_phong_ngu,
      so_phong_tam,
      huong_can_ho,
      loai_can_ho,
      noi_that,
      mo_ta,
      nguoi_cap_nhat,
      trang_thai,
      ten_toa_nha,
      truc_can_ho,
    ]);

    return res
      .status(200)
      .json({ response: "Thêm căn hộ thành công", type: true });
  } catch (error) {
    console.error("Lỗi khi thêm căn hộ:", error.message);
    return res
      .status(500)
      .json({ response: "Lỗi máy chủ, vui lòng thử lại sau", type: false });
  }
});

module.exports = router;
