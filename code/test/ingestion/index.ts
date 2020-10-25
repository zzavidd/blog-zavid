const { clearAllData } = require('./clear');
const { ingestEpistles, ingestReveries } = require('./entities/post.ingest');

Promise.resolve()
  .then(() => clearAllData())
  .then(() => {
    return Promise.all([ingestReveries(), ingestEpistles()]);
  })
  .then(() => {
    console.info('Done.');
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });