var express = require("express");
const env = require("../env/get_env");
var router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/phan-quyen", function (req, res) {
  try {
    const jwt_token = req.headers["authorization"];
    const data = jwt.verify(jwt_token, env.JWT_KEY);
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({});
  }
});

module.exports = router;
