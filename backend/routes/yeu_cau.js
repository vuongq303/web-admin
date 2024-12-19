var express = require("express");
var router = express.Router();
const connect = require("../sql/connect");
const uuid = require("uuid");
const env = require("../env/get_env");
const jwt = require("jsonwebtoken");

router.get("/danh-sach-gui-yeu-cau", function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    if (!jwt_token) {
      return res.status(401).send("<h1>Nhìn gì</h1>");
    }
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var sql = `SELECT can_ho.danh_dau,
    can_ho.gia_ban, can_ho.gia_thue, can_ho.du_an,
    can_ho.dien_tich, can_ho.so_phong_ngu,
    can_ho.so_phong_tam, can_ho.huong_can_ho,
    can_ho.loai_can_ho, can_ho.noi_that,
    can_ho.ghi_chu, can_ho.ten_toa_nha,
    can_ho.truc_can_ho, yeu_cau.* FROM can_ho
    JOIN yeu_cau ON yeu_cau.can_ho = can_ho.id 
    WHERE yeu_cau.trang_thai = 'Đang chờ' AND yeu_cau.nguoi_gui = ?`;

    if (data !== "Nhân viên") {
      sql = `SELECT can_ho.danh_dau, can_ho.chu_can_ho, can_ho.so_dien_thoai,
    can_ho.gia_ban, can_ho.gia_thue, can_ho.du_an,
    can_ho.dien_tich, can_ho.so_phong_ngu,
    can_ho.so_phong_tam, can_ho.huong_can_ho,
    can_ho.loai_can_ho, can_ho.noi_that,
    can_ho.ghi_chu, can_ho.ten_toa_nha,
    can_ho.truc_can_ho, yeu_cau.*
    FROM can_ho
    JOIN yeu_cau ON yeu_cau.can_ho = can_ho.id 
    WHERE yeu_cau.trang_thai = 'Đang chờ'`;
    }

    connect.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.status(200).send({ response: result, role: data.phan_quyen });
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin gửi yêu cầu:", error.message);
    return res
      .status(500)
      .send({ response: "Lỗi máy chủ, vui lòng thử lại sau", type: false });
  }
});

router.get("/danh-sach-duyet-yeu-cau", function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    if (!jwt_token) {
      return res.status(401).send("<h1>Nhìn gì</h1>");
    }
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    var sql = `SELECT can_ho.danh_dau,
    can_ho.gia_ban, can_ho.gia_thue, can_ho.du_an,
    can_ho.dien_tich, can_ho.so_phong_ngu,
    can_ho.so_phong_tam, can_ho.huong_can_ho,
    can_ho.loai_can_ho, can_ho.noi_that,
    can_ho.ghi_chu, can_ho.ten_toa_nha,
    can_ho.truc_can_ho, yeu_cau.* FROM can_ho
    JOIN yeu_cau ON yeu_cau.can_ho = can_ho.id 
    WHERE yeu_cau.trang_thai = 'Đã duyệt' AND yeu_cau.nguoi_gui = ?`;

    if (data !== "Nhân viên") {
      sql = `SELECT can_ho.danh_dau, can_ho.chu_can_ho, can_ho.so_dien_thoai,
    can_ho.gia_ban, can_ho.gia_thue, can_ho.du_an,
    can_ho.dien_tich, can_ho.so_phong_ngu,
    can_ho.so_phong_tam, can_ho.huong_can_ho,
    can_ho.loai_can_ho, can_ho.noi_that,
    can_ho.ghi_chu, can_ho.ten_toa_nha,
    can_ho.truc_can_ho, yeu_cau.*
    FROM can_ho
    JOIN yeu_cau ON yeu_cau.can_ho = can_ho.id 
    WHERE yeu_cau.trang_thai = 'Đã duyệt'`;
    }

    connect.query(sql, [data.tai_khoan], function (err, result, fields) {
      if (err) throw err;
      res.status(200).send(result);
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin duyệt yêu cầu:", error.message);
    return res
      .status(500)
      .send({ response: "Lỗi máy chủ, vui lòng thử lại sau", type: false });
  }
});

router.post("/gui-yeu-cau", function (req, res) {
  const { can_ho } = req.body;

  try {
    const id = uuid.v4();
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);

    const sql = `INSERT INTO yeu_cau (id, can_ho, trang_thai, nguoi_gui) 
    VALUE(?, ?, 'Đang chờ', ?)`;
    connect.query(
      sql,
      [id, can_ho, data.tai_khoan],
      function (err, result, fields) {
        if (err) throw err;
        res.status(200).json({ response: "Yêu cầu đã được gửi", type: true });
      }
    );
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu:", error.message);
    return res
      .status(500)
      .send({ response: "Lỗi máy chủ, vui lòng thử lại sau", type: false });
  }
});

router.post("/duyet-yeu-cau", function (req, res) {
  const { id } = req.body;

  try {
    const sql = `UPDATE yeu_cau SET trang_thai = 'Đã duyệt' where id = ?`;
    connect.query(sql, [id], function (err, result, fields) {
      if (err) throw err;
      res.status(200).json({ response: "Yêu cầu đã được duyệt", type: true });
    });
  } catch (error) {
    console.error("Lỗi khi xác nhận yêu cầu:", error.message);
    return res
      .status(500)
      .send({ response: "Lỗi máy chủ, vui lòng thử lại sau", type: false });
  }
});

module.exports = router;
