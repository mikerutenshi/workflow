"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pgp = exports.db = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _config = _interopRequireDefault(require("config"));

var options = {
  promiseLib: _bluebird["default"]
};

var pgp = require('pg-promise')(options);

exports.pgp = pgp;

if (process.env.NODE_ENV !== 'production') {
  var monitor = require('pg-monitor');

  monitor.attach(options);
}

var dbConfig = process.env.RDS_CONNECTION_URL || _config["default"].get('db');

var db = pgp(dbConfig); // test connection
// db.connect()
//   .then((obj) => {
//     const serverVersion = obj.client.serverVersion;
//     console.log('server: ', serverVersion);
//     obj.done();
//   })
//   .catch((error) => {
//     console.log('ERROR: ', error.message || error);
//   });

exports.db = db;
var _default = db;
exports["default"] = _default;