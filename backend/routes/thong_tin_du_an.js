var express = require("express");
var router = express.Router();
var connect = require("../bin/connect");

router.get("/du-an", async function (req, res, next) {
  connect.query("SELECT * FROM du_an", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.get("/huong-can-ho", async function (req, res, next) {
  connect.query("SELECT * FROM huong_can_ho", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.get("/loai-can-ho", async function (req, res, next) {
  connect.query("SELECT * FROM loai_can_ho", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.get("/noi-that", async function (req, res, next) {
  connect.query("SELECT * FROM noi_that", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.get("/du-an", async function (req, res, next) {
  connect.query("SELECT * FROM du_an", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.get("/toa-nha", async function (req, res, next) {
  const data = {};
  connect.query(
    "SELECT t.id, t.ten_toa_nha, d.ten_du_an FROM toa_nha t INNER JOIN du_an d ON t.du_an = d.id;",
    function (err, toaNha, fields) {
      if (err) throw err;
      data.toa_nha = toaNha;

      connect.query("SELECT * FROM du_an", function (err, duAn, fields) {
        if (err) throw err;
        data.du_an = duAn;
        res.status(200).json(data);
      });
    }
  );
});

router.get("/truc-can-ho", async function (req, res, next) {
  connect.query("SELECT * FROM truc_can_ho", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.post("/them-truc-can-ho", function (req, res, next) {
  const { truc_can } = req.body;

  const sql = "insert into truc_can_ho(truc_can) values(?)";
  connect.query(sql, [truc_can], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/cap-nhat-truc-can-ho", function (req, res, next) {
  const { truc_can, id } = req.body;

  const sql = "UPDATE truc_can_ho SET truc_can = ? WHERE id = ?";
  connect.query(sql, [truc_can, id], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/them-noi-that", function (req, res, next) {
  const { loai_noi_that } = req.body;

  const sql = "insert into noi_that(loai_noi_that) values(?)";
  connect.query(sql, [loai_noi_that], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/cap-nhat-noi-that", function (req, res, next) {
  const { loai_noi_that, id } = req.body;

  const sql = "UPDATE noi_that SET loai_noi_that = ? WHERE id = ?";
  connect.query(sql, [loai_noi_that, id], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/them-loai-can-ho", function (req, res, next) {
  const { loai_can_ho } = req.body;

  const sql = "insert into loai_can_ho(loai_can_ho) values(?)";
  connect.query(sql, [loai_can_ho], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/cap-nhat-loai-can-ho", function (req, res, next) {
  const { loai_can_ho, id } = req.body;

  const sql = "UPDATE loai_can_ho SET loai_can_ho = ? WHERE id = ?";
  connect.query(sql, [loai_can_ho, id], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/them-huong-can-ho", function (req, res, next) {
  const { huong_can_ho } = req.body;

  const sql = "insert into huong_can_ho(huong_can_ho) values(?)";
  connect.query(sql, [huong_can_ho], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/cap-nhat-huong-can-ho", function (req, res, next) {
  const { huong_can_ho, id } = req.body;

  const sql = "UPDATE huong_can_ho SET huong_can_ho = ? WHERE id = ?";
  connect.query(sql, [huong_can_ho, id], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/them-du-an", function (req, res, next) {
  const { ten_du_an } = req.body;

  const sql = "insert into du_an(ten_du_an) values(?)";
  connect.query(sql, [ten_du_an], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/cap-nhat-du-an", function (req, res, next) {
  const { ten_du_an, id } = req.body;

  const sql = "UPDATE du_an SET ten_du_an = ? WHERE id = ?";
  connect.query(sql, [ten_du_an, id], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/them-toa-nha", function (req, res, next) {
  const { toa_nha, du_an } = req.body;

  const sql = "insert into toa_nha(ten_toa_nha,du_an) values(?,?)";
  connect.query(sql, [toa_nha, du_an], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

router.post("/cap-nhat-toa-nha", function (req, res, next) {
  const { toa_nha, du_an, id } = req.body;
  
  const sql = "UPDATE toa_nha SET ten_toa_nha = ? , du_an = ? WHERE id = ?";
  connect.query(sql, [toa_nha, du_an, id], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
  });
});

module.exports = router;
