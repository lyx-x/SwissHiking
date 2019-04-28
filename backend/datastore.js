const { Datastore } = require('@google-cloud/datastore');
const config = require('../config');

// [START config]
const ds = new Datastore({
  projectId: config.GCLOUD_PROJECT
});
// [END config]

function read(namespace, kind, name) {
  const key = ds.key({
    namespace: namespace,
    path: [kind, name]
  });
  return ds.get(key);
}

// [START exports]
module.exports = {
  read
};
// [END exports]
