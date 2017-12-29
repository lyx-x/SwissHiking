var express = require('express');
var path = require('path');
var router = express.Router();

/* GET error. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

module.exports = router;
