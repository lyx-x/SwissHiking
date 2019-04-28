var express = require('express');
var router = express.Router();

const datastore = require('../datastore');

// Preload some track information
var stages = {};
var initalized = false;
datastore.read('SchweizMobil', 'TrackList', 'stage_list')
  .then((data) => {
    stages = data[0].value;
    initalized = true;
    console.log('Stages are loaded.');
  })

// Datastore access API, read-only
router.get('/:namespace/:kind/:name', function (req, res, next) {
  datastore.read(req.params.namespace, req.params.kind, req.params.name)
    .then((data) => {
      res.json(data);
    });
});

// Return a list of ids whose routes are displayable within a rectangle defined by center (lat, lon) and horizontal and vertical span
router.get('/search/:west/:south/:east/:north', function (req, res, next) {
  var visibleStages = [];
  var b_west = parseFloat(req.params.west);
  var b_south = parseFloat(req.params.south);
  var b_east = parseFloat(req.params.east);
  var b_north = parseFloat(req.params.north);
  for (i in stages) {
    var a_west = stages[i]['bbox']['west'];
    var a_south = stages[i]['bbox']['south'];
    var a_east = stages[i]['bbox']['east'];
    var a_north = stages[i]['bbox']['north'];
    if (isVisible(a_west, a_south, a_east, a_north, b_west, b_south, b_east, b_north)) {
      console.log(a_west, a_south, a_east, a_north, b_west, b_south, b_east, b_north);
      visibleStages.push(stages[i]['key']);
    }
  }
  console.log(visibleStages);
  res.json(visibleStages);
});

// check if the bbox b is visible from inside bbox a
function isVisible(a_west, a_south, a_east, a_north, b_west, b_south, b_east, b_north) {
  return isOverlapping(a_west, a_east, b_west, b_east) && isOverlapping(a_south, a_north, b_south, b_north);
}

// check if the 2 intervals are overlapping
function isOverlapping(a_left, a_right, b_left, b_right) {
  if (a_left < b_left) {
    return a_right > b_left;
  } else {
    return b_right > a_left;
  }
}

module.exports = router;
