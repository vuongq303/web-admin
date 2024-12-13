var express = require("express");
var router = express.Router();
const connect = require("../bin/connect");
var multer = require("multer");
const fs = require("fs");
const { join } = require("path");
const ip = require("../config/ipconfig.json");

router.get("/", async function (req, res) {
  connect.query("SELECT * FROM can_ho", function (err, result, fields) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = join(
      __dirname,
      "..",
      "uploads",
      `${req.body.toa_nha}-${req.body.ma_can_ho}`
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${req.body.toa_nha}-${req.body.ma_can_ho}.png`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post(
  "/them-can-ho",
  upload.array("hinh_anh", 100),
  async function (req, res) {}
);

module.exports = router;
