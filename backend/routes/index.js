var express = require("express");
var router = express.Router();

router.get("/", function (_, res) {
  res.status(200).send("Index");
});

module.exports = router;
