var express = require("express");
const { join } = require("path");
const fs = require("fs");
const moment = require("moment");
const executeQuery = require("../helper/sql_promise");
const upload = require("../middleware/can_ho");
const authentication = require("../middleware/authentication");
var router = express.Router();

router.get("/", authentication, async function (req, res) {
  try {
    const isAdmin = req.isAdmin;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let sql = `SELECT id, danh_dau, gia_ban, gia_thue, trang_thai, ten_du_an,
               dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that,
               ghi_chu, nguoi_cap_nhat, ngay_cap_nhat, hinh_anh, ten_toa_nha, truc_can_ho FROM can_ho`;

    let whereClause = "WHERE trang_thai = '0'";
    let orderByClause = "ORDER BY ngay_cap_nhat DESC";

    if (isAdmin) {
      whereClause = "";
      sql = 'SELECT * FROM can_ho'
      orderByClause = "ORDER BY trang_thai ASC";
    }

    const sqlWithLimitOffset = `${sql} ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`;

    const sqlCount = `SELECT COUNT(id) FROM can_ho ${whereClause}`;

    const [resultCount, results] = await Promise.all([
      executeQuery(sqlCount),
      executeQuery(sqlWithLimitOffset, [limit, offset])
    ]);

    res.status(200).send({
      data: results,
      isAdmin: isAdmin,
      status: true,
      total: resultCount[0]["COUNT(id)"],
    });

  } catch (error) {
    console.error("/can-ho " + error.message);
    res.status(500).send({
      response: "Lỗi lấy dữ liệu",
      status: false,
    });
  }
});

router.post("/them-anh-can-ho", authentication, upload.array("hinh_anh"), async function (req, res) {
  try {
    const files = req.files;
    const { id } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({
        response: "Không có ảnh nào được tải lên",
        status: false,
      });
    }

    const newFilePaths = files.map((file) => file.filename).join(",");
    const [resultGetHinhAnh] = await executeQuery("SELECT hinh_anh FROM can_ho WHERE id = ?", [id]);
    const existingFilePaths = resultGetHinhAnh && resultGetHinhAnh.hinh_anh ? resultGetHinhAnh.hinh_anh : '';
    const allFilePaths = existingFilePaths ? `${existingFilePaths},${newFilePaths}` : newFilePaths;
    await executeQuery("UPDATE can_ho SET hinh_anh = ? WHERE id = ?", [allFilePaths, id]);

    res.status(200).json({
      response: "Thêm ảnh thành công",
      status: true,
      data: allFilePaths.split(","),
    });
  } catch (error) {
    console.error("/them-anh-can-ho " + error.message);
    res.status(500).json({
      response: "Lỗi thêm ảnh",
      status: false,
    });
  }
});


router.post("/xoa-anh-can-ho", authentication, async function (req, res) {
  try {
    const { id, filename } = req.body;

    const filePath = join(__dirname, "..", "uploads", "can-ho", `${id}`, filename);
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      return res.status(404).json({
        response: "Ảnh không tồn tại trên hệ thống",
        status: false,
      });
    }

    const [resultGetHinhAnh] = await executeQuery("SELECT hinh_anh FROM can_ho WHERE id = ?", [id]);

    if (resultGetHinhAnh && resultGetHinhAnh.hinh_anh) {
      const listHinhAnh = resultGetHinhAnh.hinh_anh.split(",");
      const updatedHinhAnh = listHinhAnh.filter((item) => item !== filename);
      if (updatedHinhAnh.length === 0) {
        await executeQuery("UPDATE can_ho SET hinh_anh = NULL WHERE id = ?", [id]);
      } else {
        await executeQuery("UPDATE can_ho SET hinh_anh = ? WHERE id = ?", [updatedHinhAnh.join(","), id]);
      }

      return res.status(200).json({
        response: "Xóa ảnh thành công",
        status: true,
        data: updatedHinhAnh,
      });
    }

    res.status(404).json({
      response: "Lỗi xóa ảnh, không tìm thấy dữ liệu",
      status: false,
    });
  } catch (err) {
    console.error("/xoa-anh-can-ho " + err.message);
    res.status(500).json({
      response: "Lỗi xóa ảnh",
      status: false,
    });
  }
});


router.post("/them-can-ho", authentication, async (req, res) => {
  try {
    const user = req.user;
    const {
      chu_can_ho, so_dien_thoai, ma_can_ho, ten_toa_nha, ten_du_an, dien_tich,
      so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu,
      gia_ban, gia_thue, truc_can_ho, danh_dau, trang_thai
    } = req.body;

    if (!ma_can_ho || !ten_toa_nha || !truc_can_ho) {
      return res.status(400).json({
        response: "Vui lòng cung cấp đủ thông tin về căn hộ",
        status: false,
      });
    }

    const checkSql = "SELECT * FROM can_ho WHERE ma_can_ho = ? and ten_toa_nha = ? and truc_can_ho = ?";
    const checkMaCanHoExist = await executeQuery(checkSql, [ma_can_ho, ten_toa_nha, truc_can_ho]);

    if (checkMaCanHoExist.length > 0) {
      return res.status(409).json({
        response: "Căn hộ đã tồn tại",
        status: false,
      });
    }

    const sqlCanHo = `INSERT INTO can_ho 
        (ma_can_ho, chu_can_ho, so_dien_thoai, gia_ban,
        gia_thue, ten_du_an, dien_tich, so_phong_ngu,
        so_phong_tam, huong_can_ho, loai_can_ho,
        noi_that, ghi_chu, nguoi_cap_nhat, ngay_cap_nhat,
        trang_thai, ten_toa_nha, truc_can_ho, danh_dau) 
        VALUES (?, ? ,? ,? ,? ,? , ?, ?, ? ,? ,? , ?, ?, ?, ?, ?, ?, ?, ?)`;

    const nguoi_cap_nhat = user.ho_ten;
    const ngay_cap_nhat = moment().format("YYYY-MM-DD");

    const result = await executeQuery(sqlCanHo, [
      ma_can_ho, chu_can_ho, so_dien_thoai, gia_ban, gia_thue, ten_du_an, dien_tich, so_phong_ngu,
      so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, ngay_cap_nhat,
      trang_thai, ten_toa_nha, truc_can_ho, danh_dau
    ]);

    return res.status(201).json({
      response: "Thêm căn hộ thành công",
      status: true,
      id: result.insertId,
      nguoi_cap_nhat: nguoi_cap_nhat,
      ngay_cap_nhat: ngay_cap_nhat,
    });
  } catch (error) {
    console.error("/them-can-ho: " + error.message);
    res.status(500).json({
      response: "Lỗi thêm căn hộ, vui lòng thử lại",
      status: false,
    });
  }
});


router.post("/cap-nhat-can-ho", authentication, async (req, res) => {
  try {
    const user = req.user;
    const {
      chu_can_ho, so_dien_thoai, dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho,
      loai_can_ho, noi_that, ghi_chu, gia_ban, gia_thue, danh_dau, id
    } = req.body;

    if (!id) {
      return res.status(400).json({
        response: "ID căn hộ không hợp lệ",
        status: false,
      });
    }

    const nguoi_cap_nhat = user.ho_ten;
    const ngay_cap_nhat = moment().format("YYYY-MM-DD");

    const sqlGetCurrentData = "SELECT * FROM can_ho WHERE id = ?";
    const [currentData] = await executeQuery(sqlGetCurrentData, [id]);

    if (!currentData) {
      return res.status(404).json({
        response: "Căn hộ không tồn tại",
        status: false,
      });
    }

    const fieldsToUpdate = [
      chu_can_ho, so_dien_thoai, gia_ban, gia_thue, dien_tich, so_phong_ngu, so_phong_tam,
      huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, ngay_cap_nhat, danh_dau
    ];

    const updatedFields = fieldsToUpdate.some((value, index) => value !== Object.values(currentData)[index]);

    if (updatedFields) {
      const sqlCanHo = `
        UPDATE can_ho SET 
          chu_can_ho = ?, so_dien_thoai = ?, gia_ban = ?, gia_thue = ?, dien_tich = ?, 
          so_phong_ngu = ?, so_phong_tam = ?, huong_can_ho = ?, loai_can_ho = ?, noi_that = ?, 
          ghi_chu = ?, nguoi_cap_nhat = ?, ngay_cap_nhat = ?, danh_dau = ? WHERE id = ?`;

      await executeQuery(sqlCanHo, [
        chu_can_ho, so_dien_thoai, gia_ban, gia_thue, dien_tich, so_phong_ngu, so_phong_tam,
        huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, ngay_cap_nhat, danh_dau, id
      ]);

      return res.status(200).json({
        response: "Cập nhật căn hộ thành công",
        status: true,
        nguoi_cap_nhat: nguoi_cap_nhat,
        ngay_cap_nhat: ngay_cap_nhat,
      });
    } else {
      return res.status(200).json({
        response: "Không có thay đổi để cập nhật",
        status: true,
      });
    }
  } catch (error) {
    console.error("/cap-nhat-can-ho" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật căn hộ",
      status: false,
    });
  }
});

router.post("/cap-nhat-trang-thai", authentication, async function (req, res) {
  try {
    const { trang_thai, id, danh_dau } = req.body;
    const sql = "UPDATE can_ho SET trang_thai = ?, danh_dau = ? WHERE id = ?";
    await executeQuery(sql, [trang_thai, danh_dau, id]);
    res.status(200).json({
      response: "Cập nhật trạng thái thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-trang-thai" + error.message);
    res.status(500).json({ response: "Error", status: false });
  }
});

router.post("/upload-excel", authentication, async (req, res) => {
  try {
    const listData = req.body;

    if (!Array.isArray(listData) || listData.length === 0) {
      return res.status(400).json({
        response: "Dữ liệu tải lên không hợp lệ",
        status: false,
      });
    }

    const result = listData.map((item) => [
      item.ten_du_an || "",
      item.ten_toa_nha || "",
      item.ma_can_ho || "",
      item.truc_can_ho || "",
      item.chu_can_ho || "",
      item.so_dien_thoai || "",
      item.loai_can_ho || "",
      item.dien_tich || 0,
      item.so_phong_ngu || 0,
      item.so_phong_tam || 0,
      item.gia_ban || 0,
      item.gia_thue || 0,
      item.noi_that || "",
      item.huong_can_ho || "",
      item.ghi_chu || "",
    ]);

    const sql = `
      INSERT INTO can_ho (
        ten_du_an, ten_toa_nha, ma_can_ho, truc_can_ho, chu_can_ho, 
        so_dien_thoai, loai_can_ho, dien_tich, so_phong_ngu, so_phong_tam, 
        gia_ban, gia_thue, noi_that, huong_can_ho, ghi_chu
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        ten_du_an = COALESCE(NULLIF(VALUES(ten_du_an), ''), ten_du_an),
        chu_can_ho = COALESCE(NULLIF(VALUES(chu_can_ho), ''), chu_can_ho),
        so_dien_thoai = COALESCE(NULLIF(VALUES(so_dien_thoai), ''), so_dien_thoai),
        loai_can_ho = COALESCE(NULLIF(VALUES(loai_can_ho), ''), loai_can_ho),
        dien_tich = COALESCE(NULLIF(VALUES(dien_tich), 0), dien_tich),
        so_phong_ngu = COALESCE(NULLIF(VALUES(so_phong_ngu), 0), so_phong_ngu),
        so_phong_tam = COALESCE(NULLIF(VALUES(so_phong_tam), 0), so_phong_tam),
        gia_ban = COALESCE(NULLIF(VALUES(gia_ban), 0), gia_ban),
        gia_thue = COALESCE(NULLIF(VALUES(gia_thue), 0), gia_thue),
        noi_that = COALESCE(NULLIF(VALUES(noi_that), ''), noi_that),
        huong_can_ho = COALESCE(NULLIF(VALUES(huong_can_ho), ''), huong_can_ho),
        ghi_chu = COALESCE(NULLIF(VALUES(ghi_chu), ''), ghi_chu)`;

    await executeQuery(sql, [result]);

    res.status(200).json({
      response: "Tải dữ liệu lên thành công",
      status: true
    });
  } catch (error) {
    console.error("/upload-excel: " + error.message);
    res.status(500).json({
      response: "Lỗi tải lên dữ liệu",
      status: false
    });
  }
});

module.exports = router;
