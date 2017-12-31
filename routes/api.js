var express = require('express');
var router = express.Router();
var path = require('path');

/* GET data from StatsProvider. */
router.get('/stats/:region/:geotype/:geoyear/:dispatch', function(req, res, next) {
  var filepath = path.join(__dirname, "../data", req.params['region'],
    req.params['region'] + '_' + req.params['geotype'] + '_' + req.params['geoyear'] + '_' + req.params['dispatch'] + '.json'
  );
  var geojson = require(filepath);
  res.send(geojson);
});

module.exports = router;
