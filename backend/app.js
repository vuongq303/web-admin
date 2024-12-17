var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
const canHoRouter = require("./routes/can_ho");
const thongTinDuAnRouter = require("./routes/thong_tin_du_an");
const nguoiDungRouter = require("./routes/nguoi_dung");
const khachHangRouter = require("./routes/khach_hang");
const timKiemRouter = require("./routes/tim_kiem");
const khachHangNguonRouter = require("./routes/khach_hang_nguon");

var app = express();
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/can-ho", canHoRouter);
app.use("/thong-tin-du-an", thongTinDuAnRouter);
app.use("/nguoi-dung", nguoiDungRouter);
app.use("/khach-hang", khachHangRouter);
app.use("/tim-kiem", timKiemRouter);
app.use("/khach-hang-nguon", khachHangNguonRouter);

module.exports = app;
