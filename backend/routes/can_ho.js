var express = require("express");
const { join } = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const momnet = require("moment");
const env = require("../env/get_env");
const upload = require("../middleware/upload_can_ho");
const executeQuery = require("../sql/promise");
const now = momnet();
var router = express.Router();

router.get("/", async function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var sql = `SELECT id, danh_dau,
    gia_ban, gia_thue,
    trang_thai, du_an,
    dien_tich, so_phong_ngu,
    so_phong_tam, huong_can_ho,
    loai_can_ho, noi_that,
    ghi_chu, nguoi_cap_nhat,
    hinh_anh, ten_toa_nha,
    truc_can_ho FROM can_ho
    WHERE trang_thai = '0'`;

    if (data.phan_quyen === "Admin") {
      sql = `SELECT * FROM can_ho ORDER BY trang_thai ASC`;
    }

    const result = await executeQuery(sql);
    res.status(200).send({ response: result, role: data.phan_quyen });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ response: [], type: false });
  }
});

router.post(
  "/them-anh-can-ho",
  upload.array("hinh_anh"),
  async function (req, res) {
    try {
      const files = req.files;
      const { id } = req.body;

      var filePath = files.map((file) => file.filename);
      const [resultGetHinhAnh] = await executeQuery(
        "SELECT hinh_anh FROM can_ho WHERE id = ?",
        [id]
      );
      const listHinhAnh = resultGetHinhAnh.hinh_anh.split(",");
      const resultHinhAnh = [...filePath, ...listHinhAnh];
      var path = resultHinhAnh.join(",");

      await executeQuery("UPDATE can_ho SET hinh_anh = ? WHERE id = ?", [
        path,
        id,
      ]);
      res.status(200).json({
        response: "Thêm ảnh thành công",
        type: true,
        data: resultHinhAnh,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ response: "Lỗi thêm ảnh", type: false });
    }
  }
);

router.post("/xoa-anh-can-ho", async function (req, res) {
  try {
    const { id, filename } = req.body;
    const filePath = join(
      __dirname,
      "..",
      "uploads",
      "can-ho",
      `${id}`,
      filename
    );

    await fs.promises.unlink(filePath);
    const sqlGetHinhAnh = "SELECT hinh_anh FROM can_ho WHERE id = ?";
    const [resultGetHinhAnh] = await executeQuery(sqlGetHinhAnh, [id]);

    if (resultGetHinhAnh.hinh_anh) {
      const listHinhAnh = resultGetHinhAnh.hinh_anh.split(",");
      const updatedHinhAnh = listHinhAnh.filter((item) => item !== filename);
      const listUpdateHinhAnh = updatedHinhAnh.join(",");

      await executeQuery("UPDATE can_ho SET hinh_anh = ? WHERE id = ?", [
        listUpdateHinhAnh,
        id,
      ]);
      return res
        .status(200)
        .json({
          response: "Xóa ảnh thành công",
          type: true,
          data: updatedHinhAnh,
        });
    }

    res
      .status(400)
      .json({ response: "Lỗi xóa ảnh, không tìm thấy dữ liệu", type: false });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ response: "Lỗi hệ thống", type: false });
  }
});

router.post("/them-can-ho", async (req, res) => {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var {
      chu_can_ho,
      so_dien_thoai,
      ma_can_ho,
      ten_toa_nha,
      ten_du_an,
      dien_tich,
      so_phong_ngu,
      so_phong_tam,
      huong_can_ho,
      loai_can_ho,
      noi_that,
      ghi_chu,
      gia_ban,
      gia_thue,
      truc_can_ho,
      danh_dau,
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

    const sqlCanHo = `
        INSERT INTO can_ho 
        (ma_can_ho, chu_can_ho, so_dien_thoai, gia_ban,
        gia_thue, du_an, dien_tich, so_phong_ngu,
        so_phong_tam, huong_can_ho, loai_can_ho,
        noi_that, ghi_chu, nguoi_cap_nhat,
        trang_thai, ten_toa_nha,truc_can_ho, danh_dau) 
        VALUES (?, ? ,? ,? ,? ,? , ?, ?, ? ,? ,? ,? , ?, ?, ?, ?, ?, ?)`;

    const result = await executeQuery(sqlCanHo, [
      ma_can_ho,
      chu_can_ho,
      so_dien_thoai,
      gia_ban,
      gia_thue,
      ten_du_an,
      dien_tich,
      so_phong_ngu,
      so_phong_tam,
      huong_can_ho,
      loai_can_ho,
      noi_that,
      ghi_chu,
      `${data.ho_ten} đã cập nhật ngày ${now.format("DD/MM/YYYY")}`,
      trang_thai,
      ten_toa_nha,
      truc_can_ho,
      danh_dau,
    ]);

    res
      .status(200)
      .json({
        response: "Thêm căn hộ thành công",
        type: true,
        id: result.insertId,
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ response: "Lỗi thêm căn hộ", type: false });
  }
});

router.post("/cap-nhat-can-ho", async (req, res) => {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var {
      chu_can_ho,
      so_dien_thoai,
      ten_du_an,
      dien_tich,
      so_phong_ngu,
      so_phong_tam,
      huong_can_ho,
      loai_can_ho,
      noi_that,
      mo_ta,
      gia_ban,
      gia_thue,
      danh_dau,
      id,
    } = req.body;

    const sqlCanHo = `
        UPDATE can_ho SET chu_can_ho = ?,
        so_dien_thoai = ?, gia_ban = ?,
        gia_thue = ?, du_an = ?,
        dien_tich = ?, so_phong_ngu = ?,
        so_phong_tam = ?, huong_can_ho = ?,
        loai_can_ho = ?, noi_that = ?,
        ghi_chu = ?, nguoi_cap_nhat = ?,
        danh_dau = ? WHERE id = ?`;

    await executeQuery(sqlCanHo, [
      chu_can_ho,
      so_dien_thoai,
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
      `${data.ho_ten} đã cập nhật ngày ${now.format("DD/MM/YYYY")}`,
      danh_dau,
      id,
    ]);

    res
      .status(200)
      .json({ response: "Cập nhật căn hộ thành công", type: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ response: "Lỗi cập nhật căn hộ", type: false });
  }
});

router.post("/cap-nhat-trang-thai", async function (req, res) {
  try {
    const { trang_thai, id, danh_dau } = req.body;
    const sql = "UPDATE can_ho SET trang_thai = ?, danh_dau = ? WHERE id = ?";

    await executeQuery(sql, [trang_thai, danh_dau, id]);
    res
      .status(200)
      .json({ response: "Cập nhật trạng thái thành công", type: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ response: "Error", type: false });
  }
});

module.exports = router;
