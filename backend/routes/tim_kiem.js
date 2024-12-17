var express = require("express");
var router = express.Router();
const connect = require("../bin/connect");
const jwt = require("jsonwebtoken");
const env = require("../env/get_env");

router.get("/", function (req, res) {
  var value = [];
  var condition = [];
  const jwt_token = req.headers["authorization"];

  if (!jwt_token) {
    return res.status(401).send("Not allowed");
  }
  const data = jwt.verify(jwt_token, env.JWT_KEY);
  var sql =
    "select id, danh_dau, gia_ban, gia_thue, trang_thai, du_an, dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that, ghi_chu, nguoi_cap_nhat, hinh_anh, ten_toa_nha, truc_can_ho from can_ho";
  if (data.phan_quyen === "Admin") {
    sql = `select * from can_ho`;
  }

  const {
    ten_du_an,
    ten_toa_nha,
    loai_noi_that,
    loai_can_ho,
    huong_can_ho,
    so_phong_ngu,
    truc_can_ho,
    loc_gia,
    gia_ban_tu,
    gia_ban_den,
    gia_thue_tu,
    gia_thue_den,
  } = req.query;

  if (ten_du_an !== "") {
    condition.push("du_an = ?");
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

  if (gia_ban_tu !== "" && gia_ban_den !== "") {
    condition.push("gia_ban between ? and ?");
    value.push(...[gia_ban_tu, gia_ban_den]);
  }

  if (gia_thue_tu !== "" && gia_thue_den !== "") {
    condition.push("gia_thue between ? and ?");
    value.push(...[gia_thue_tu, gia_thue_den]);
  }

  if (condition.length > 0) {
    const filter = condition.join(" and ");
    sql += ` where ${filter}`;
    if (loc_gia === "Giá bán tăng dần" || loc_gia === "Giá bán giảm dần") {
      sql += " and gia_ban > 0";
    } else if (
      loc_gia === "Giá thuê tăng dần" ||
      loc_gia === "Giá thuê giảm dần"
    ) {
      sql += " and gia_thue > 0";
    }
  } else {
    if (loc_gia === "Giá bán tăng dần" || loc_gia === "Giá bán giảm dần") {
      sql += " where gia_ban > 0";
    } else if (
      loc_gia === "Giá thuê tăng dần" ||
      loc_gia === "Giá thuê giảm dần"
    ) {
      sql += " where gia_thue > 0";
    }
  }

  switch (loc_gia) {
    case "Giá bán tăng dần":
      sql += " order by gia_ban asc";
      break;
    case "Giá bán giảm dần":
      sql += " order by gia_ban desc";
      break;
    case "Giá thuê tăng dần":
      sql += " order by gia_thue asc";
      break;
    case "Giá thuê giảm dần":
      sql += " order by gia_thue desc";
      break;
    default:
      break;
  }

  connect.query(sql, value, function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

module.exports = router;
