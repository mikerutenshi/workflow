"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var _pgPromise = _interopRequireDefault(require("pg-promise"));

var _randToken = _interopRequireDefault(require("rand-token"));

var _db = require("../db");

var _sql = require("../sql");

var _DateUtil = _interopRequireDefault(require("../helpers/DateUtil"));

var QueryResultError = _pgPromise["default"].errors.QueryResultError;
var User = {
  create: function create(req, res, next) {
    var body = req.body;
    body.password = _bcryptjs["default"].hashSync(body.password, 10);

    if (!body.last_name) {
      body.last_name = null;
    }

    _db.db.none(_sql.user.create, body).then(function () {
      res.status(201).json({
        status: 'Created',
        message: 'User berhasil dibuat'
      });
    })["catch"](function (err) {
      if (err.message.includes('duplicate key value')) {
        return res.status(200).json({
          status: 'OK',
          message: 'User tersebut sudah terdaftar'
        });
      }

      return next(err);
    });
  },
  getAll: function getAll(req, res, next) {
    var query = 'SELECT * FROM app_user';

    _db.db.any(query).then(function (result) {
      var data = result.map(function (u) {
        var password = u.password,
            userWithoutPassword = (0, _objectWithoutProperties2["default"])(u, ["password"]);
        return userWithoutPassword;
      });
      res.status(200).json({
        status: 'OK',
        data: data,
        message: 'Semua user berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  "delete": function _delete(req, res, next) {
    var ids = req.query.id;

    _db.db.none('DELETE FROM app_user WHERE id in ($1:csv)', [ids]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Berhasil menghapus user'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  authenticate: function authenticate(req, res, next) {
    _db.db.task( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
        var activeUser, accessToken, refreshToken, encryptedAccessToken, password, userWithoutPassword, data, currentDate, refreshTokenExp, allUser;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return t.one('SELECT * FROM app_user WHERE username = $1 AND is_active = true', req.body.username);

              case 3:
                activeUser = _context.sent;

                if (!(activeUser && _bcryptjs["default"].compareSync(req.body.password, activeUser.password))) {
                  _context.next = 26;
                  break;
                }

                accessToken = _jsonwebtoken["default"].sign({
                  sub: activeUser.id,
                  role: activeUser.role
                }, _config["default"].secret, {
                  expiresIn: _config["default"].accessTokenExpiration
                });
                refreshToken = _randToken["default"].uid(256);
                encryptedAccessToken = _bcryptjs["default"].hashSync(refreshToken, 10);
                password = activeUser.password, userWithoutPassword = (0, _objectWithoutProperties2["default"])(activeUser, ["password"]);
                data = userWithoutPassword;
                data.access_token = accessToken;
                data.refresh_token = refreshToken;
                currentDate = new Date();
                refreshTokenExp = _DateUtil["default"].addDays(currentDate, _config["default"].refreshTokenExpiration);
                _context.prev = 14;
                _context.next = 17;
                return t.none('UPDATE app_user SET refresh_token = $1, refresh_token_exp_date = $3 WHERE app_user.id = $2', [encryptedAccessToken, activeUser.id, refreshTokenExp]);

              case 17:
                // addMinute change to addDays on prod
                data.refresh_token_exp_date = refreshTokenExp;
                return _context.abrupt("return", res.status(200).json({
                  status: 'OK',
                  data: data,
                  message: 'Berhasil masuk'
                }));

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](14);
                return _context.abrupt("return", next(_context.t0));

              case 24:
                _context.next = 27;
                break;

              case 26:
                return _context.abrupt("return", res.status(401).json({
                  status: 'Unauthorized',
                  message: 'Password salah'
                }));

              case 27:
                _context.next = 44;
                break;

              case 29:
                _context.prev = 29;
                _context.t1 = _context["catch"](0);

                if (!(_context.t1 instanceof QueryResultError)) {
                  _context.next = 43;
                  break;
                }

                _context.prev = 32;
                _context.next = 35;
                return _db.db.one('SELECT * FROM app_user WHERE username = $1', req.body.username);

              case 35:
                allUser = _context.sent;

                if (!allUser) {
                  _context.next = 38;
                  break;
                }

                return _context.abrupt("return", res.status(401).json({
                  status: 'Unauthorized',
                  message: 'Status user belum aktif. Hubungi developer'
                }));

              case 38:
                _context.next = 43;
                break;

              case 40:
                _context.prev = 40;
                _context.t2 = _context["catch"](32);
                return _context.abrupt("return", res.status(401).json({
                  status: 'Unauthorized',
                  message: 'Username ini tidak ditemukan'
                }));

              case 43:
                return _context.abrupt("return", next(_context.t1));

              case 44:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 29], [14, 21], [32, 40]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  },
  //  async authenticate(req, res, next) {
  //    try {
  //      const activeUser = await db.one('SELECT * FROM app_user WHERE username = $1 AND is_active = true', req.body.username);
  //
  //      if (activeUser && bcrypt.compareSync(req.body.password, activeUser.password)) {
  //        const accessToken = jwt.sign({ sub: activeUser.id, role: activeUser.role }, config.secret, { expiresIn: config.accessTokenExpiration });
  //        const refreshToken = jwt.sign({ sub: activeUser.id, role: activeUser.role }, config.secret, { expiresIn: config.refreshTokenExpiration });
  //        const { password, ...userWithoutPassword } = activeUser;
  //        const data = userWithoutPassword;
  //        data.access_token = accessToken;
  //        data.refresh_token = refreshToken;
  //
  //        return res.status(200)
  //          .json({
  //            status: 'OK',
  //            data,
  //            message: 'Berhasil masuk'
  //          });
  //      } else {
  //        return res.status(401)
  //          .json({
  //            status: 'Unauthorized',
  //            message: 'Password salah'
  //          });
  //      }
  //    } catch (err) {
  //      if (err instanceof QueryResultError) {
  //        try {
  //          const allUser = await db.one('SELECT * FROM app_user WHERE username = $1', req.body.username);
  //
  //          if (allUser) {
  //            return res.status(401)
  //              .json({
  //                status: 'Unauthorized',
  //                message: 'Status user belum aktif. Hubungi developer'
  //              });
  //          }
  //        } catch (error) {
  //          return res.status(404)
  //            .json({
  //              status: 'Not Found',
  //              message: 'Username ini tidak ditemukan'
  //            });
  //        }
  //      }
  //      return next(err);
  //    }
  //  },
  changeActiveStatus: function changeActiveStatus(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var isActive, userId;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              isActive = req.query.is_active;
              userId = req.params.id;
              _context2.prev = 2;
              _context2.next = 5;
              return _db.db.none('UPDATE app_user SET is_active = $1:raw WHERE id = $2', [isActive, userId]);

            case 5:
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                message: "Status user berhasil dirubah menjadi ".concat(isActive)
              }));

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](2);
              return _context2.abrupt("return", next(_context2.t0));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 8]]);
    }))();
  },
  refreshToken: function refreshToken(req, res) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var authedUser, currentDate, accessToken, data;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _db.db.one('SELECT * FROM app_user WHERE username = $1 AND is_active = true AND refresh_token IS NOT NULL', req.body.username);

            case 3:
              authedUser = _context3.sent;
              currentDate = new Date();

              if (authedUser && _bcryptjs["default"].compareSync(req.body.refresh_token, authedUser.refresh_token)) {
                // refresh token is authorized ask for new access token
                accessToken = _jsonwebtoken["default"].sign({
                  sub: authedUser.id,
                  role: authedUser.role
                }, _config["default"].secret, {
                  expiresIn: _config["default"].accessTokenExpiration
                });
                data = {
                  access_token: accessToken
                };

                if (authedUser && currentDate > authedUser.refresh_token_exp_date) {
                  res.status(401).json({
                    status: 'Unauthorized',
                    message: 'Refresh token is expired'
                  });
                } else {
                  res.status(200).json({
                    status: 'OK',
                    data: data,
                    message: 'Berhasil generate access token baru'
                  });
                }
              } else {
                res.status(401).json({
                  status: 'Unauthorized',
                  message: 'Refresh token is invalid'
                });
              }

              _context3.next = 11;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](0);
              res.status(401).json({
                status: 'Unauthorized',
                message: 'Refresh token is not registered'
              });

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 8]]);
    }))();
  },
  signOut: function signOut(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _db.db.none('UPDATE app_user SET refresh_token = NULL, refresh_token_exp_date = NULL WHERE app_user.username = $1', [req.body.username]);

            case 3:
              return _context4.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'User berhasil di-signout'
              }));

            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", next(_context4.t0));

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 6]]);
    }))();
  }
};
var _default = User;
exports["default"] = _default;