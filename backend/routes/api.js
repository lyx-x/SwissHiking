var express = require('express');
var router = express.Router();

const datastore = require('../datastore');

// Datastore access API, read-only
router.get('/:namespace/:kind/:name', function(req, res, next) {
  datastore.read(req.params.namespace, req.params.kind, req.params.name)
  .then((data) => {
    res.json(data);
  });
});

module.exports = router;
