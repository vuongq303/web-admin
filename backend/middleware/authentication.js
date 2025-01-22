const jwt = require("jsonwebtoken");
const env = require("../config/env");

function authentication(req, res, next) {
  const token = req.cookies.TOKEN;

  if (!token) {
    return res.status(401).json({
      response: "No token provided",
      status: false,
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      response: "Invalid token",
      status: false,
    });
  }
}

module.exports = authentication;
