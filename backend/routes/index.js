var express = require("express");
const authentication = require("../middleware/authentication");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: 200 });
});

router.get("/phan-quyen", authentication, function (req, res) {
  try {
    const data = req.user;
    res.status(200).json(data);
  } catch (error) {
    console.error("/phan-quyen" + error.message);
    res.status(500).json({});
  }
});

module.exports = router;
