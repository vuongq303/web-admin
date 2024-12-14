var multer = require("multer");
const fs = require("fs");
const { join } = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { ten_toa_nha, ma_can_ho, truc_can_ho } = req.body;

    const dir = join(
      __dirname,
      "..",
      "uploads",
      `${ten_toa_nha}-${ma_can_ho}${truc_can_ho}`
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.png`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

module.exports = upload;
