var express = require("express");
var router = express.Router();
const executeQuery = require("../sql/promise");
const authentication = require("../middleware/authentication");

router.get("/", authentication, async function (req, res) {
  try {
    var result = {};

    const resultToaNha = await executeQuery("SELECT * FROM toa_nha");
    result.toa_nha = resultToaNha;

    const resultHuongCanHo = await executeQuery("SELECT * FROM huong_can_ho");
    result.huong_can_ho = resultHuongCanHo;

    const resultLoaiCanHo = await executeQuery("SELECT * FROM loai_can_ho");
    result.loai_can_ho = resultLoaiCanHo;

    const resultNoiThat = await executeQuery("SELECT * FROM noi_that");
    result.noi_that = resultNoiThat;

    const resultTrucCanHo = await executeQuery("SELECT * FROM truc_can_ho");
    result.truc_can_ho = resultTrucCanHo;

    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send([]);
  }
});

router.get("/truc-can-ho", authentication, async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM truc_can_ho");
    res.status(200).send({
      data: result,
      status: true,
    });
  } catch (error) {
    console.error("/truc-can-ho" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-truc-can-ho", authentication, async function (req, res) {
  try {
    const { truc_can } = req.body;
    const sql = "INSERT INTO truc_can_ho(truc_can) VALUE(?)";
    const result = await executeQuery(sql, [truc_can]);

    res.status(200).json({
      response: "Thêm trục căn hộ mới thành công",
      id: result.insertId,
      status: true,
    });
  } catch (error) {
    console.error("/them-truc-can-ho" + error.message);
    res.status(500).json({
      response: "Lỗi thêm trục căn hộ",
      status: false,
    });
  }
});

router.post("/cap-nhat-truc-can-ho", authentication, async function (req, res) {
  try {
    const { truc_can, id } = req.body;
    const sql = "UPDATE truc_can_ho SET truc_can = ? WHERE id = ?";
    await executeQuery(sql, [truc_can, id]);

    res.status(200).json({
      response: "Cập nhật trục căn hộ mới thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-truc-can-ho" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật trục căn hộ",
      status: false,
    });
  }
});

router.get("/toa-nha", authentication, async function (_, res) {
  try {
    const result = {};

    const resultToaNha = await executeQuery("SELECT * from toa_nha");
    result.toa_nha = resultToaNha;

    const resultDuAn = await executeQuery("SELECT * FROM du_an");
    result.du_an = resultDuAn;

    res.status(200).send({ data: result, status: true });
  } catch (error) {
    console.error("/toa-nha" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-toa-nha", authentication, async function (req, res) {
  try {
    const { ten_toa_nha, ten_du_an } = req.body;
    const sql = "INSERT INTO toa_nha(ten_toa_nha, ten_du_an) value(?, ?)";
    const result = await executeQuery(sql, [ten_toa_nha, ten_du_an]);

    res.status(200).json({
      response: "Thêm tòa nhà thành công",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-toa-nha" + error.message);
    res.status(500).json({
      response: "Lỗi thêm tòa nhà",
      status: false,
    });
  }
});

router.post("/cap-nhat-toa-nha", authentication, async function (req, res) {
  try {
    const { ten_toa_nha, ten_du_an, id } = req.body;
    const sql =
      "UPDATE toa_nha SET ten_toa_nha = ? , ten_du_an = ? WHERE id = ?";
    await executeQuery(sql, [ten_toa_nha, ten_du_an, id]);

    res.status(200).json({
      response: "Cập nhật tòa nhà thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-toa-nha" + error.message);
    res.status(500).json({ response: "Lỗi cập nhật tòa nhà", status: false });
  }
});

router.get("/noi-that", authentication, async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM noi_that");
    res.status(200).send({ data: result, status: true });
  } catch (error) {
    console.error("/noi-that" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-noi-that", authentication, async function (req, res) {
  try {
    const { loai_noi_that } = req.body;

    const sql = "INSERT INTO noi_that(loai_noi_that) VALUE(?)";
    const result = await executeQuery(sql, [loai_noi_that]);
    res.status(200).json({
      response: "Thêm nội thất thành công",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-noi-that" + error.message);
    res.status(500).json({
      response: "Lỗi thêm nội thất",
      status: false,
    });
  }
});

router.post("/cap-nhat-noi-that", authentication, async function (req, res) {
  try {
    const { loai_noi_that, id } = req.body;
    const sql = "UPDATE noi_that SET loai_noi_that = ? WHERE id = ?";

    await executeQuery(sql, [loai_noi_that, id]);
    res.status(200).json({
      response: "Cập nhật nội thất thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-noi-that" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật nội thất",
      status: false,
    });
  }
});

router.get("/loai-can-ho", authentication, async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM loai_can_ho");
    res.status(200).send({ data: result, status: true });
  } catch (error) {
    console.error("/loai-can-ho" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-loai-can-ho", authentication, async function (req, res) {
  try {
    const { loai_can_ho } = req.body;
    const sql = "INSERT INTO loai_can_ho(loai_can_ho) value(?)";
    const result = await executeQuery(sql, [loai_can_ho]);
    res.status(200).json({
      response: "Thêm loại căn hộ thành công",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-loai-can-ho" + error.message);
    res.status(500).json({
      response: "Lỗi thêm loại căn hộ",
      status: false,
    });
  }
});

router.post("/cap-nhat-loai-can-ho", authentication, async function (req, res) {
  try {
    const { loai_can_ho, id } = req.body;
    const sql = "UPDATE loai_can_ho SET loai_can_ho = ? WHERE id = ?";
    await executeQuery(sql, [loai_can_ho, id]);
    res.status(200).json({
      response: "Cập nhật loại căn hộ thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-loai-can-ho" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật loại căn hộ",
      status: false,
    });
  }
});

router.get("/huong-can-ho", authentication, async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM huong_can_ho");
    res.status(200).send({ data: result, status: true });
  } catch (error) {
    console.error("/huong-can-ho" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-huong-can-ho", authentication, async function (req, res) {
  try {
    const { huong_can_ho } = req.body;
    const sql = "INSERT INTO huong_can_ho(huong_can_ho) value(?)";
    const result = await executeQuery(sql, [huong_can_ho]);
    res.status(200).json({
      response: "Thêm hướng căn hộ thành công",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-huong-can-ho" + error.message);
    res.status(500).json({
      response: "Lỗi thêm hướng căn hộ",
      status: false,
    });
  }
});

router.post("/cap-nhat-huong-can-ho", authentication, async function (req, res) {
  try {
    const { huong_can_ho, id } = req.body;

    const sql = "UPDATE huong_can_ho SET huong_can_ho = ? WHERE id = ?";
    await executeQuery(sql, [huong_can_ho, id]);
    res.status(200).json({
      response: "Cập nhật hướng căn hộ thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-huong-can-ho" + error.message);
    res.status(200).json({
      response: "Lỗi cập nhật hướng căn hộ",
      status: false,
    });
  }
});

router.get("/du-an", authentication, async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM du_an");
    res.status(200).send({ data: result, status: true });
  } catch (error) {
    console.error("/du-an" + error.message);
    res.status(500).send({
      status: false,
      response: "Lỗi khi lấy dữ liệu",
    });
  }
});

router.post("/them-du-an", authentication, async function (req, res) {
  try {
    const { ten_du_an } = req.body;
    const sql = "INSERT INTO du_an(ten_du_an) value(?)";

    const result = await executeQuery(sql, [ten_du_an]);
    res.status(200).json({
      response: "Thêm dự án thành công",
      status: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("/them-du-an" + error.message);
    res.status(500).json({
      response: "Lỗi thêm dự án",
      status: false,
    });
  }
});

router.post("/cap-nhat-du-an", authentication, async function (req, res) {
  try {
    const { ten_du_an, id } = req.body;
    const sql = "UPDATE du_an SET ten_du_an = ? WHERE id = ?";

    await executeQuery(sql, [ten_du_an, id]);
    res.status(200).json({
      response: "Cập nhật dự án thành công",
      status: true,
    });
  } catch (error) {
    console.error("/cap-nhat-du-an" + error.message);
    res.status(500).json({
      response: "Lỗi cập nhật dự án",
      status: true,
    });
  }
});

module.exports = router;
