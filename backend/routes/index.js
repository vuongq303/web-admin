var express = require("express");
var router = express.Router();
var connect = require("../bin/connect");

router.get("/", async function (req, res, next) {
  res.status(200).send("Index");
});

router.get("/phan-quyen", function (req, res) {
  connect.query("SELECT * FROM phan_quyen", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

module.exports = router;
