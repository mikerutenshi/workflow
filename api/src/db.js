import promise from 'bluebird';
import config from 'config';

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);

if (process.env.NODE_ENV !== 'production') {
  const monitor = require('pg-monitor');
  monitor.attach(options);
}

const dbConfig = process.env.RDS_CONNECTION_URL || config.get('db');

const db = pgp(
  dbConfig
);

// test connection
// db.connect()
//   .then((obj) => {
//     const serverVersion = obj.client.serverVersion;
//     console.log('server: ', serverVersion);
//     obj.done();
//   })
//   .catch((error) => {
//     console.log('ERROR: ', error.message || error);
//   });

export { db, pgp };
export default db;
