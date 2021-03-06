var express = require('express');
var router = express.Router();

const {PubSub} = require('@google-cloud/pubsub');

// Creates a client
const pubsub = new PubSub();
const topicName = 'data-updater';

const dataBuffer = Buffer.from('');

/* Update the list of tracks from SchweizMobil. */
router.get('/update/schweizmobil/tracklist', function (req, res, next) {
  if (req.headers['x-appengine-cron']) {
    // Add two custom attributes to the message
    const customAttributes = {
      source: 'SchweizMobil',
      update_list: 'true',
    };

    pubsub.topic(topicName)
      .publisher()
      .publish(dataBuffer, customAttributes)
      .then((messageId) => console.log(`Message ${messageId} published.`));
    
    res.send('Track coordinates updated.');
  } else {
    res.status(403);
    res.send('Admin API is limited to Cron job.');
  }
});

/* Update one track info from SchweizMobil. */
router.get('/update/schweizmobil/track', function (req, res, next) {
  if (req.headers['x-appengine-cron']) {
    // Add two custom attributes to the message
    const customAttributes = {
      source: 'SchweizMobil',
      update_track: 'true',
    };

    pubsub.topic(topicName)
      .publisher()
      .publish(dataBuffer, customAttributes)
      .then((messageId) => console.log(`Message ${messageId} published.`));

    res.send('Track coordinates updated.')
  } else {
    res.status(403);
    res.send('Admin API is limited to Cron job.');
  }
});

/* Cleanup old data. */
router.get('/clean', function (req, res, next) {
  res.send('Done database cleaning.')
});

module.exports = router;
