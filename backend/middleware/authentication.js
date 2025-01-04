const jwt = require("jsonwebtoken");
const env = require("../env/get_env");

function authentication(req, res, next) {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json({ response: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ response: "Invalid token" });
  }
}

module.exports = authentication;
