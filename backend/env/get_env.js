require("dotenv").config();

const env = {
  JWT_KEY: process.env.JWT_KEY || "19dmfafaf?kajijorrra224578;'rawoBHBNK8u**n0204jqlohwfkklmamafanflnv??kkf*&T()JJ(njjflafn6t66vgvkfaNNNFA6gy3683rgq",
  PORT: process.env.PORT || "8080",
  HOSTNAME: process.env.HOSTNAME || "localhost",
  DATABASE_USER: process.env.DATABASE_USER || "root",
  DATABASE: process.env.DATABASE || "connect_home",
  DATABASE_PORT: process.env.DATABASE_PORT || 3306,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || ""
};
module.exports = env;
