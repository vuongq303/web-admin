var express = require("express");
var router = express.Router();
const authentication = require("../middleware/authentication");

router.get("/phan-quyen", authentication, function (req, res) {
  try {
    const data = req.user;
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({});
  }
});

module.exports = router;
