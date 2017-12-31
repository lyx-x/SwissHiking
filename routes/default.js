var express = require('express');
var path = require('path');
var router = express.Router();

// Redirect everything to the index page, apart from the routes imported before this module
router.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

module.exports = router;
