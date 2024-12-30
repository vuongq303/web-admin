var express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const { join } = require("path");

var indexRouter = require("./routes/index");
const canHoRouter = require("./routes/can_ho");
const thongTinDuAnRouter = require("./routes/thong_tin_du_an");
const nguoiDungRouter = require("./routes/nguoi_dung");
const khachHangRouter = require("./routes/khach_hang");
const timKiemRouter = require("./routes/tim_kiem");
const khachHangNguonRouter = require("./routes/khach_hang_nguon");
const yeuCauRouter = require("./routes/yeu_cau");

var app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());

app.use(express.static(join(__dirname, "uploads")));
app.use(express.static(join(__dirname, "views")));

app.use("/", indexRouter);
app.use("/can-ho", canHoRouter);
app.use("/thong-tin-du-an", thongTinDuAnRouter);
app.use("/nguoi-dung", nguoiDungRouter);
app.use("/khach-hang", khachHangRouter);
app.use("/tim-kiem", timKiemRouter);
app.use("/khach-hang-nguon", khachHangNguonRouter);
app.use("/yeu-cau", yeuCauRouter);

app.get("*", (req, res) => {
  res.status(200).sendFile(join(__dirname, "views", "build", "index.html"));
});

app.use((req, res, next) => {
  res.status(404).send("Không tìm thấy trang này");
});

module.exports = app;
