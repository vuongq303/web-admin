var express = require("express");
var router = express.Router();
const executeQuery = require("../sql/promise");
const config = require("../config/config");
const authentication = require("../middleware/authentication");

router.get("/can-ho", authentication, async function (req, res) {
  try {
    const isAdmin = req.isAdmin;
    const isSale = req.isSale;

    if (!isAdmin && !isSale) {
      return res.status(403).send({ response: "Không có quyền truy cập", status: false });
    }

    const { limit = 10, offset = 0, loc_gia, gia_tu, gia_den, ...filters } = req.query;
    let condition = [!isAdmin ? "trang_thai = '0'" : "1=1"];
    let value = [];

    Object.entries(filters).forEach(([key, val]) => {
      if (val) {
        condition.push(`${key} = ?`);
        value.push(val);
      }
    });

    const isGiaBan = [config.giaBanTangDan, config.giaBanGiamDan].includes(loc_gia);
    const isGiaThue = [config.giaThueTangDan, config.giaThueGiamDan].includes(loc_gia);

    if (gia_tu && gia_den) {
      if (isGiaBan) {
        condition.push("gia_ban BETWEEN ? AND ?");
      } else if (isGiaThue) {
        condition.push("gia_thue BETWEEN ? AND ?");
      }
      value.push(gia_tu, gia_den);
    }

    if (isGiaBan) condition.push("gia_ban > 0");
    if (isGiaThue) condition.push("gia_thue > 0");

    let sqlCondition = condition.length ? ` WHERE ${condition.join(" AND ")}` : "";

    let orderBy = " ORDER BY trang_thai ASC";
    if (loc_gia) {
      const orderMap = {
        [config.giaBanTangDan]: "gia_ban ASC",
        [config.giaBanGiamDan]: "gia_ban DESC",
        [config.giaThueTangDan]: "gia_thue ASC",
        [config.giaThueGiamDan]: "gia_thue DESC",
      };
      orderBy += `, ${orderMap[loc_gia]}`;
    }

    const queryCount = `SELECT COUNT(*) as count FROM can_ho ${sqlCondition}`;
    let queryData = `SELECT * FROM can_ho ${sqlCondition} ${orderBy} LIMIT ? OFFSET ?`;

    if (!isAdmin) {
      queryData = `SELECT id, danh_dau, gia_ban, gia_thue, trang_thai, ten_du_an,
      dien_tich, so_phong_ngu, so_phong_tam, huong_can_ho, loai_can_ho, noi_that,
      ghi_chu, nguoi_cap_nhat, ngay_cap_nhat, hinh_anh, ten_toa_nha, truc_can_ho FROM can_ho ${sqlCondition} ${orderBy} LIMIT ? OFFSET ?`;
    }

    const [resultCount, result] = await Promise.all([
      executeQuery(queryCount, value),
      executeQuery(queryData, [...value, Number(limit), Number(offset)])
    ]);

    res.status(200).send({
      data: result,
      status: true,
      count: resultCount[0].count,
    });
  } catch (error) {
    console.error("/list" + error.message);
    res.status(500).send({ response: "Lỗi tìm kiếm", status: false });
  }
});

module.exports = router;
