var express = require("express");
var router = express.Router();
const connect = require("../bin/connect");

router.get("/", async function (req, res) {
  connect.query("SELECT * FROM can_ho", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

module.exports = router;
