var express = require('express');
var router = express.Router();

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const Datastore = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = Datastore();

/**
 * Insert a visit record into the database.
 *
 * @param {object} visit The visit record to insert.
 */
function insertVisit(visit) {
  return datastore.save({
    key: datastore.key('visit'),
    data: visit
  });
}

/**
 * Retrieve the latest 10 visit records from the database.
 */
function getVisits() {
  const query = datastore.createQuery('visit')
    .order('timestamp', { descending: true })
    .limit(10);

  return datastore.runQuery(query)
    .then((results) => {
      const entities = results[0];
      return entities.map((entity) => `Time: ${entity.timestamp}, AddrHash: ${entity.userIp}`);
    });
}

/* Parse the list of tracks from SchweizMobil. */
router.get('/crawler/schweizmobil/tracklist', function (req, res, next) {
  // Create a visit record to be stored in the database
  const visit = {
    timestamp: new Date(),
    // Store a hash of the visitor's ip address
    userIp: req.ip
  };

  insertVisit(visit)
    // Query the last 10 visits from Datastore.
    .then(() => getVisits())
    .then((visits) => {
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Last 10 visits:\n${visits.join('\n')}`)
        .end();
    })
    .catch(next);
});

/* Parse coordinates of all tracks from SchweizMobil. */
router.get('/crawler/schweizmobil/tracks', function (req, res, next) {
  res.send('Track coordinates updated.')
});

/* Cleanup old data. */
router.get('/cleaner', function (req, res, next) {
  res.send('Done database cleaning.')
});

module.exports = router;
