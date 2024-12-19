var multer = require("multer");
const fs = require("fs");
const { join } = require("path");

const storage = multer.diskStorage({
  destination: (req, hinh_anh, cb) => {
    const dir = join(__dirname, "..", "uploads", req.body.tai_khoan);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, _, cb) => {
    cb(null, `${req.body.tai_khoan}.png`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = upload;
