var express = require("express");
var router = express.Router();
const executeQuery = require("../sql/promise");

router.get("/", async function (req, res) {
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
    console.error( error.message);
    res.status(500).send([]);
  }
});

router.get("/truc-can-ho", async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM truc_can_ho")
    res.status(200).json(result)
  } catch (error) {
    console.error(error.message)
  }
});

router.post("/them-truc-can-ho", async function (req, res) {
  try {
    const { truc_can } = req.body;
    const sql = "INSERT INTO truc_can_ho(truc_can) VALUE(?)";
    const result = await executeQuery(sql, [truc_can])
    res.status(200).json({ response: "Thêm trục căn mới thành công", id: result.insertId, type: true })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.post("/cap-nhat-truc-can-ho", async function (req, res) {
  try {
    const { truc_can, id } = req.body;
    const sql = "UPDATE truc_can_ho SET truc_can = ? WHERE id = ?";
    await executeQuery(sql, [truc_can, id])
    res.status(200).json({ response: "Cập nhật trục căn mới thành công", type: true })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.get("/toa-nha", async function (_, res) {
  try {
    const result = {}

    const resultToaNha = await executeQuery("SELECT * from toa_nha")
    result.toa_nha = resultToaNha

    const resultDuAn = await executeQuery("SELECT * FROM du_an")
    result.du_an = resultDuAn

    res.status(200).send(result)
  } catch (error) {
    res.status(500).send({})
  }
});

router.post("/them-toa-nha", async function (req, res) {
  try {
    const { ten_toa_nha, ten_du_an } = req.body;
    const sql = "INSERT INTO toa_nha(ten_toa_nha, ten_du_an) value(?, ?)";
    const result = await executeQuery(sql, [ten_toa_nha, ten_du_an])
    res.status(200).json({ response: "Thêm tòa nhà thành công", type: true, id: result.insertId })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.post("/cap-nhat-toa-nha", async function (req, res) {
  try {
    const { ten_toa_nha, ten_du_an, id } = req.body;
    const sql = "UPDATE toa_nha SET ten_toa_nha = ? , ten_du_an = ? WHERE id = ?";
    await executeQuery(sql, [ten_toa_nha, ten_du_an, id])
    res.status(200).json({ response: "Cập nhật tòa nhà thành công", type: true })
  } catch (error) {
    console.error(error.message);
    res.status(500).json({})
  }
});

router.get("/noi-that", async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM noi_that")
    res.status(200).send(result)
  } catch (error) {
    console.error(error.message);
    res.status(500).send({})
  }
});

router.post("/them-noi-that", async function (req, res) {
  try {
    const { loai_noi_that } = req.body;

    const sql = "INSERT INTO noi_that(loai_noi_that) VALUE(?)";
    const result = await executeQuery(sql, [loai_noi_that])
    res.status(200).json({ response: "Thêm nội thất thành công", type: true, id: result.insertId });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({});
  }
});

router.post("/cap-nhat-noi-that", async function (req, res) {
  try {
    const { loai_noi_that, id } = req.body;
    const sql = "UPDATE noi_that SET loai_noi_that = ? WHERE id = ?";

    await executeQuery(sql, [loai_noi_that, id])
    res.status(200).json({ response: "Cập nhật nội thất thành công", type: true })
  } catch (error) {
    console.error(error.message);
    res.status(500).json({});
  }
});

router.get("/loai-can-ho", async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM loai_can_ho")
    res.status(200).send(result)
  } catch (error) {
    console.error(error.message);
    res.status(500).send([])
  }
});

router.post("/them-loai-can-ho", async function (req, res) {
  try {
    const { loai_can_ho } = req.body
    const sql = "INSERT INTO loai_can_ho(loai_can_ho) value(?)";
    const result = await executeQuery(sql, [loai_can_ho])
    res.status(200).json({ response: "Thêm loại căn hộ thành công", type: true, id: result.insertId })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.post("/cap-nhat-loai-can-ho", async function (req, res) {
  try {
    const { loai_can_ho, id } = req.body;
    const sql = "UPDATE loai_can_ho SET loai_can_ho = ? WHERE id = ?";
    await executeQuery(sql, [loai_can_ho, id])
    res.status(200).json({ response: "Cập nhật loại căn hộ thành công", type: true })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.get("/huong-can-ho", async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM huong_can_ho");
    res.status(200).send(result);
  } catch (error) {
    console.error(error.message)
    res.status(500).send([])
  }
});

router.post("/them-huong-can-ho", async function (req, res) {
  try {
    const { huong_can_ho } = req.body;
    const sql = "INSERT INTO huong_can_ho(huong_can_ho) value(?)"
    const result = await executeQuery(sql, [huong_can_ho])
    res.status(200).json({ response: "Thêm hướng căn hộ thành công", type: true, id: result.insertId })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.post("/cap-nhat-huong-can-ho", async function (req, res) {
  try {
    const { huong_can_ho, id } = req.body;

    const sql = "UPDATE huong_can_ho SET huong_can_ho = ? WHERE id = ?";
    await executeQuery(sql, [huong_can_ho, id])
    res.status(200).json({ response: "Cập nhật hướng căn hộ thành công", type: true })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.get("/du-an", async function (_, res) {
  try {
    const result = await executeQuery("SELECT * FROM du_an")
    res.status(200).send(result)
  } catch (error) {
    console.error(error.message)
    res.status(500).send([])
  }
});

router.post("/them-du-an", async function (req, res) {
  try {
    const { ten_du_an } = req.body;
    const sql = "INSERT INTO du_an(ten_du_an) value(?)";

    const result = await executeQuery(sql, [ten_du_an])
    res.status(200).json({ response: "Thêm dự án thành công", type: true, id: result.insertId })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});

router.post("/cap-nhat-du-an", async function (req, res) {
  try {
    const { ten_du_an, id } = req.body;
    const sql = "UPDATE du_an SET ten_du_an = ? WHERE id = ?";

    await executeQuery(sql, [ten_du_an, id])
    res.status(200).json({ response: "Cập nhật dự án thành công", type: true })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({})
  }
});


module.exports = router;
