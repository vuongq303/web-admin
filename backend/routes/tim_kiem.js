var express = require("express");
var router = express.Router();
const executeQuery = require("../sql/promise");
const config = require("../config/config");
const authentication = require("../middleware/authentication");

router.get("/admin", authentication, async function (req, res) {
  try {
    var value = [];
    var condition = [];
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    var sql = "SELECT * FROM can_ho";

    const {
      ten_du_an,
      ten_toa_nha,
      loai_noi_that,
      loai_can_ho,
      huong_can_ho,
      so_phong_ngu,
      truc_can_ho,
      loc_gia,
      gia_tu,
      gia_den,
    } = req.query;

    if (ten_du_an !== "") {
      condition.push("ten_du_an = ?");
      value.push(ten_du_an);
    }

    if (ten_toa_nha !== "") {
      condition.push("ten_toa_nha = ?");
      value.push(ten_toa_nha);
    }

    if (loai_noi_that !== "") {
      condition.push("noi_that = ?");
      value.push(loai_noi_that);
    }

    if (loai_can_ho !== "") {
      condition.push("loai_can_ho = ?");
      value.push(loai_can_ho);
    }

    if (huong_can_ho !== "") {
      condition.push("huong_can_ho = ?");
      value.push(huong_can_ho);
    }

    if (so_phong_ngu !== "") {
      condition.push("so_phong_ngu = ?");
      value.push(so_phong_ngu);
    }

    if (truc_can_ho !== "") {
      condition.push("truc_can_ho = ?");
      value.push(truc_can_ho);
    }

    const gia_ban =
      loc_gia === config.giaBanTangDan || loc_gia === config.giaBanGiamDan;

    const gia_thue =
      loc_gia === config.giaThueTangDan || loc_gia === config.giaThueGiamDan;

    if (gia_tu !== "" && gia_den !== "") {
      if (gia_ban) {
        condition.push("gia_ban BETWEEN ? AND ?");
        value.push(...[gia_tu, gia_den]);
      } else if (gia_thue) {
        condition.push("gia_thue BETWEEN ? AND ?");
        value.push(...[gia_tu, gia_den]);
      }
    }

    if (condition.length > 0) {
      if (gia_ban) {
        condition.push("gia_ban > 0");
      } else if (gia_thue) {
        condition.push("gia_thue > 0");
      }

      const filter = condition.join(" AND ");
      sql += ` WHERE ${filter}`;
    } else {
      if (gia_ban) {
        sql += " WHERE gia_ban > 0";
      } else if (gia_thue) {
        sql += " WHERE gia_thue > 0";
      }
    }

    sql += " ORDER BY trang_thai ASC";
    switch (loc_gia) {
      case config.giaBanTangDan:
        sql += ", gia_ban ASC";
        break;
      case config.giaBanGiamDan:
        sql += ", gia_ban DESC";
        break;
      case config.giaThueTangDan:
        sql += ", gia_thue ASC";
        break;
      case config.giaThueGiamDan:
        sql += ", gia_thue DESC";
        break;
      default:
        break;
    }

    const result = await executeQuery(
      sql + ` LIMIT ${limit} OFFSET ${offset}`,
      value
    );
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send([]);
  }
});

router.get("/sale", authentication, async function (req, res) {
  try {
    var value = [];
    var condition = [];
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    var sql = `SELECT id, danh_dau, gia_ban, gia_thue, trang_thai, ten_du_an, dien_tich, so_phong_ngu,
      so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, hinh_anh,
      ten_toa_nha, truc_can_ho FROM can_ho WHERE trang_thai = '0'`;

    const {
      ten_du_an,
      ten_toa_nha,
      loai_noi_that,
      loai_can_ho,
      huong_can_ho,
      so_phong_ngu,
      truc_can_ho,
      loc_gia,
      gia_tu,
      gia_den,
    } = req.query;

    if (ten_du_an !== "") {
      condition.push("ten_du_an = ?");
      value.push(ten_du_an);
    }

    if (ten_toa_nha !== "") {
      condition.push("ten_toa_nha = ?");
      value.push(ten_toa_nha);
    }

    if (loai_noi_that !== "") {
      condition.push("noi_that = ?");
      value.push(loai_noi_that);
    }

    if (loai_can_ho !== "") {
      condition.push("loai_can_ho = ?");
      value.push(loai_can_ho);
    }

    if (huong_can_ho !== "") {
      condition.push("huong_can_ho = ?");
      value.push(huong_can_ho);
    }

    if (so_phong_ngu !== "") {
      condition.push("so_phong_ngu = ?");
      value.push(so_phong_ngu);
    }

    if (truc_can_ho !== "") {
      condition.push("truc_can_ho = ?");
      value.push(truc_can_ho);
    }

    const gia_ban =
      loc_gia === config.giaBanTangDan || loc_gia === config.giaBanGiamDan;

    const gia_thue =
      loc_gia === config.giaThueTangDan || loc_gia === config.giaThueGiamDan;

    if (gia_tu !== "" && gia_den !== "") {
      if (gia_ban) {
        condition.push("gia_ban BETWEEN ? AND ?");
        value.push(...[gia_tu, gia_den]);
      } else if (gia_thue) {
        condition.push("gia_thue BETWEEN ? AND ?");
        value.push(...[gia_tu, gia_den]);
      }
    }

    if (gia_ban) {
      condition.push("gia_ban > 0");
    } else if (gia_thue) {
      condition.push("gia_thue > 0");
    }

    if (condition.length > 0) {
      const filter = condition.join(" AND ");
      sql += ` AND ${filter}`;
    }

    sql += " ORDER BY ";
    switch (loc_gia) {
      case config.giaBanTangDan:
        sql += "gia_ban ASC";
        break;
      case config.giaBanGiamDan:
        sql += "gia_ban DESC";
        break;
      case config.giaThueTangDan:
        sql += "gia_thue ASC";
        break;
      case config.giaThueGiamDan:
        sql += "gia_thue DESC";
        break;
      default:
        break;
    }
    console.log(`\n${sql}\n`);

    const result = await executeQuery(
      sql + ` LIMIT ${limit} OFFSET ${offset}`,
      value
    );
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send([]);
  }
});

module.exports = router;
