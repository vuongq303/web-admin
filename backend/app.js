var express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const { join } = require("path");

const phanQuyenRouter = require("./routes/phan_quyen");
const canHoRouter = require("./routes/can_ho");
const thongTinDuAnRouter = require("./routes/thong_tin_du_an");
const nguoiDungRouter = require("./routes/nguoi_dung");
const khachHangRouter = require("./routes/khach_hang");
const timKiemRouter = require("./routes/tim_kiem");
const khachHangNguonRouter = require("./routes/khach_hang_nguon");
const yeuCauRouter = require("./routes/yeu_cau");
const indexRouter = require("./routes/index");
const config = require("./config/config");

var app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: config.client,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.static(join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/api", phanQuyenRouter);
app.use("/api/can-ho", canHoRouter);
app.use("/api/thong-tin-du-an", thongTinDuAnRouter);
app.use("/api/nguoi-dung", nguoiDungRouter);
app.use("/api/khach-hang", khachHangRouter);
app.use("/api/tim-kiem", timKiemRouter);
app.use("/api/khach-hang-nguon", khachHangNguonRouter);
app.use("/api/yeu-cau", yeuCauRouter);

module.exports = app;
