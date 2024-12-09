var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const canHoRouter = require("./routes/can_ho");

var app = express();
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/can-ho", canHoRouter);

module.exports = app;
