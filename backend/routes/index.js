var express = require("express");
const authentication = require("../middleware/authentication");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: 200 });
});

router.get("/phan-quyen", authentication, function (req, res) {
  try {
    const user = req.user;
    res.status(200).json({ ...user, status: true });
  } catch (error) {
    console.error("/phan-quyen" + error.message);
    res.status(500).json({ status: false });
  }
});

router.get('/auth', authentication, async function (req, res) {
  try {
    const user = req.user;
    
  } catch (error) {
    console.error('/auth', error.message);
    res.status(500).json({ status: false });
  }

});

module.exports = router;
