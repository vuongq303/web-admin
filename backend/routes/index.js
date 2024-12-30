var express = require("express");
const env = require("../env/get_env");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { join } = require("path");

router.get("/", (req, res) => {
  res
    .status(200)
    .sendFile(join(__dirname, "..", "views", "build", "index.html"));
});

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
