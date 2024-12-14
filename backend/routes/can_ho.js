var express = require("express");
var router = express.Router();
const connect = require("../bin/connect");
const upload = require("../middleware/upload_can_ho");
const { join } = require("path");
const fs = require("fs");

router.get("/", async function (req, res) {
  connect.query(
    `select can_ho.*, khach_hang.ten_khach_hang, khach_hang.so_dien_thoai, khach_hang.loai_giao_dich
    from can_ho
    join khach_hang on can_ho.khach_hang =  khach_hang.id`,
    function (err, result, fields) {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

router.post(
  "/them-anh-can-ho",
  upload.array("hinh_anh"),
  async function (req, res) {
    const files = req.files;
    const ma_can_ho = req.body.ma_can_ho;
    if (!files[0]) {
      return res
        .status(200)
        .json({ response: "Lỗi thêm ảnh", type: false, data: "" });
    }
    var filePath = files.map((file) => file.filename);
    const sql =
      "UPDATE can_ho SET hinh_anh = CONCAT(hinh_anh, ?) WHERE ma_can_ho = ?";

    try {
      await executeQuery(sql, [`,${filePath.join(",")}`, ma_can_ho]);
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
  const { filename, ma_can_ho } = req.body;
  const filePath = join(__dirname, "..", "uploads", ma_can_ho, filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        response: "File not found",
        type: false,
      });
    }

    await fs.promises.unlink(filePath);

    const sqlGetHinhAnh = "SELECT hinh_anh FROM can_ho WHERE ma_can_ho = ?";
    const [resultGetHinhAnh] = await executeQuery(sqlGetHinhAnh, [ma_can_ho]);

    if (resultGetHinhAnh && resultGetHinhAnh.hinh_anh) {
      const listHinhAnh = resultGetHinhAnh.hinh_anh.split(",");
      const updatedHinhAnh = listHinhAnh
        .filter((item) => item !== filename)
        .join(",");

      if (updatedHinhAnh === resultGetHinhAnh.hinh_anh) {
        return res.status(200).json({
          response: "Image not found in the database",
          type: false,
        });
      }

      await executeQuery("UPDATE can_ho SET hinh_anh = ? WHERE ma_can_ho = ?", [
        updatedHinhAnh,
        ma_can_ho,
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

router.post("/them-can-ho", upload.array("hinh_anh"), async (req, res) => {
  try {
    const files = req.files || [];
    const {
      ten_khach_hang,
      so_dien_thoai,
      ma_can_ho,
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
      trang_thai,
    } = req.body;

    if (
      !ten_khach_hang ||
      !so_dien_thoai ||
      !ma_can_ho ||
      !loai_giao_dich ||
      !ngay_ki_hop_dong
    ) {
      return res
        .status(400)
        .json({ response: "Dữ liệu không hợp lệ", type: false });
    }
    const sql = "SELECT * FROM can_ho WHERE ma_can_ho = ?";
    const checkMaCanHoExist = await executeQuery(sql, [
      ma_can_ho.toLowerCase(),
    ]);

    if (checkMaCanHoExist.length > 0) {
      return res
        .status(200)
        .json({ response: "Mã căn hộ đã tồn tại", type: false });
    }

    const filePath = files.map((file) => file.filename).join(",");

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
        (ma_can_ho, khach_hang, gia_ban, gia_thue, du_an, dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, hinh_anh, trang_thai) 
        VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?, ?, ?)`;
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
      filePath,
      trang_thai,
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
