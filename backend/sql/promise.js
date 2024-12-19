const connect = require("./connect");

const executeQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    connect.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = executeQuery;
