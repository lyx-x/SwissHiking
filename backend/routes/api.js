var express = require('express');
var router = express.Router();

const datastore = require('../datastore');

var mcache = require('memory-cache');
var cache = (duration) => {
  return (req, res, next) => {
    var key = '__express__' + req.originalUrl || req.url;
    var cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      }
    }
  }
}

// Datastore access API, read-only
router.get('/:namespace/:kind/:name', function(req, res, next) {
  datastore.read(req.params.namespace, req.params.kind, req.params.name)
  .then((data) => {
    res.json(data);
  });
});

module.exports = router;
