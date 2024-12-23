var express = require("express");
var router = express.Router();
const uuid = require("uuid");
const env = require("../env/get_env");
const jwt = require("jsonwebtoken");
const executeQuery = require("../sql/promise");
const moment = require("moment");
const { join } = require("path");
const fs = require("fs");

router.get("/danh-sach-gui-yeu-cau", async function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var sql = `SELECT can_ho.danh_dau,
    can_ho.gia_ban, can_ho.gia_thue, can_ho.ten_du_an,
    can_ho.dien_tich, can_ho.so_phong_ngu,
    can_ho.so_phong_tam, can_ho.huong_can_ho,
    can_ho.loai_can_ho, can_ho.noi_that,
    can_ho.ghi_chu, can_ho.ten_toa_nha,
    can_ho.truc_can_ho, can_ho.ma_can_ho, can_ho.hinh_anh,
    yeu_cau.* FROM can_ho JOIN yeu_cau
    ON yeu_cau.can_ho = can_ho.id 
    WHERE yeu_cau.trang_thai = '0' AND yeu_cau.nguoi_gui = '${data.tai_khoan}'`;

    if (data.phan_quyen === env.admin || data.phan_quyen === env.quan_ly) {
      sql = `SELECT can_ho.danh_dau, can_ho.chu_can_ho,
      can_ho.so_dien_thoai, can_ho.gia_ban, can_ho.gia_thue,
      can_ho.ten_du_an, can_ho.dien_tich, can_ho.so_phong_ngu,
      can_ho.so_phong_tam, can_ho.huong_can_ho,can_ho.loai_can_ho,
      can_ho.noi_that, can_ho.ghi_chu, can_ho.ten_toa_nha, 
      can_ho.truc_can_ho, can_ho.ma_can_ho, can_ho.hinh_anh,
      yeu_cau.* FROM can_ho JOIN yeu_cau
      ON yeu_cau.can_ho = can_ho.id WHERE yeu_cau.trang_thai = '0'`;
    }

    const result = await executeQuery(sql);
    res.status(200).send({ response: result, role: data.phan_quyen });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ response: [], type: false });
  }
});

router.get("/danh-sach-duyet-yeu-cau", async function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var sql = `SELECT can_ho.danh_dau,
    can_ho.gia_ban, can_ho.gia_thue, can_ho.ten_du_an,
    can_ho.dien_tich, can_ho.so_phong_ngu,
    can_ho.so_phong_tam, can_ho.huong_can_ho,
    can_ho.loai_can_ho, can_ho.noi_that,
    can_ho.ghi_chu, can_ho.ten_toa_nha,
    can_ho.truc_can_ho,can_ho.hinh_anh ,yeu_cau.* FROM can_ho
    JOIN yeu_cau ON yeu_cau.can_ho = can_ho.id 
    WHERE yeu_cau.trang_thai = '1' AND yeu_cau.nguoi_gui = ?`;

    if (data.phan_quyen === env.nhan_vien) {
      sql = `SELECT can_ho.danh_dau, can_ho.chu_can_ho,
      can_ho.so_dien_thoai, can_ho.gia_ban, can_ho.gia_thue,
      can_ho.ten_du_an, can_ho.dien_tich, can_ho.so_phong_ngu,
      can_ho.so_phong_tam, can_ho.huong_can_ho,
      can_ho.loai_can_ho, can_ho.noi_that,
      can_ho.ghi_chu, can_ho.ten_toa_nha,
      can_ho.truc_can_ho,can_ho.hinh_anh ,yeu_cau.*
      FROM can_ho JOIN yeu_cau ON yeu_cau.can_ho = can_ho.id 
      WHERE yeu_cau.trang_thai = '1'`;
    }

    const result = await executeQuery(sql, [data.tai_khoan]);
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ response: [], type: false });
  }
});

router.post("/gui-yeu-cau", async function (req, res) {
  try {
    const { can_ho } = req.body;
    const jsonPath = join(__dirname, "..", "config", "yeu_cau.json");
    let now = moment();
    const start = now.format("HH:mm DD-MM-YYYY");
    const end = now.add(60, "minute").format("HH:mm DD-MM-YYYY");

    const id = uuid.v4();
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    const schedule = {
      tai_khoan: data.tai_khoan,
      bat_dau: start,
      ket_thuc: end,
    };

    if (!fs.existsSync(jsonPath)) {
      fs.writeFileSync(jsonPath, JSON.stringify([], null, 2));
    }

    const checkExist =
      "SELECT id from yeu_cau WHERE trang_thai = ? AND can_ho = ? AND nguoi_gui = ?";
    const dataExist = await executeQuery(checkExist, [
      "0",
      can_ho,
      data.tai_khoan,
    ]);

    if (dataExist.length > 0) {
      return res
        .status(200)
        .json({ response: "Gửi yêu cầu trùng lặp", type: false });
    }

    const sql = `INSERT INTO yeu_cau (id, can_ho, trang_thai, nguoi_gui) 
    VALUE(?, ?, ?, ?)`;

    await executeQuery(sql, [id, can_ho, 0, data.tai_khoan]);
    const fileData = fs.readFileSync(jsonPath, "utf8");
    const yeuCauArray = JSON.parse(fileData);
    const isDuplicate = yeuCauArray.some(
      (yeu_cau) => yeu_cau.tai_khoan === schedule.tai_khoan
    );

    if (!isDuplicate) {
      yeuCauArray.push(schedule);
      fs.writeFileSync(jsonPath, JSON.stringify(yeuCauArray, null, 2));
    }
    res.status(200).json({ response: "Yêu cầu đã được gửi", type: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ response: "Error", type: false });
  }
});

router.post("/duyet-yeu-cau", async function (req, res) {
  try {
    const { id } = req.body;
    const sql = `UPDATE yeu_cau SET trang_thai = '1' where id = ?`;
    await executeQuery(sql, [id]);

    res.status(200).json({ response: "Yêu cầu đã được duyệt", type: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ response: "Error", type: false });
  }
});

router.post("/xoa-yeu-cau", async function (req, res) {
  try {
    const { id } = req.body;
    const sql = `DELETE FROM yeu_cau WHERE id = ?`;
    await executeQuery(sql, [id]);
    res.status(200).json({ response: "Đã xóa yêu cầu", type: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ response: "Error", type: false });
  }
});

module.exports = router;
