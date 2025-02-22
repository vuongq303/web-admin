var app = require("../app");
var http = require("http");
const mysql = require("../database/sql");
const env = require("../config/env");
const schedule = require("node-schedule");
const fs = require("fs");
const { join } = require("path");
const moment = require("moment");
const executeQuery = require("../helper/sql_promise");
const port = env.PORT;

mysql.getConnection(function (err, connection) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

async function performTask() {
  const jsonPath = join(__dirname, "..", "temp", "yeu_cau.json");
  const now = moment();

  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify([], null, 2));
  }

  const fileData = fs.readFileSync(jsonPath, "utf8");
  const yeuCauArray = JSON.parse(fileData);

  const yeuCauHetHan = [];

  const yeuCauConLai = yeuCauArray.filter((yeu_cau) => {
    const endTime = moment(yeu_cau.ket_thuc, "HH:mm DD-MM-YYYY", true);
    const isExpired = endTime.isSameOrBefore(now);
    if (isExpired) {
      yeuCauHetHan.push(yeu_cau);
    }
    return !isExpired;
  });

  if (yeuCauHetHan.length > 0) {
    const taiKhoanArray = yeuCauHetHan.map((item) => item.tai_khoan);
    await executeQuery("DELETE FROM yeu_cau WHERE nguoi_gui IN (?)", [
      taiKhoanArray,
    ]);
  }

  fs.writeFileSync(jsonPath, JSON.stringify(yeuCauConLai, null, 2));
}

schedule.scheduleJob("*/60 * * * *", performTask);

var server = http.createServer(app);

server.listen(port, () => console.log("Running in port " + port));