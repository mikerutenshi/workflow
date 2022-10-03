"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _db = require("../db");

var _position = _interopRequireDefault(require("../helpers/position"));

var _DateUtil = _interopRequireDefault(require("../helpers/DateUtil"));

var _role = _interopRequireDefault(require("../helpers/role"));

var pgp = require('pg-promise')({
  capSQL: true
});

var getDbPositionKey = function getDbPositionKey(positionName) {
  var positionKey;

  switch (positionName) {
    case _position["default"].DRAWER:
      positionKey = 'is_drawn';
      break;

    case _position["default"].SEWER:
      positionKey = 'is_sewn';
      break;

    case _position["default"].ASSEMBLER:
      positionKey = 'is_assembled';
      break;

    case _position["default"].SOLE_STITCHER:
      positionKey = 'is_sole_stitched';
      break;

    case _position["default"].INSOLE_STITCHER:
      positionKey = 'is_insole_stitched';
      break;

    case _position["default"].LINING_DRAWER:
      positionKey = 'is_lining_drawn';
      break;

    default:
      break;
  }

  return positionKey;
};

var WorkerWork = {
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var foundDuplicate, query;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              foundDuplicate = /*#__PURE__*/function () {
                var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                  var isDuplicateFound, promises;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          isDuplicateFound = false;
                          promises = req.body.map( /*#__PURE__*/function () {
                            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(item) {
                              var foundItem;
                              return _regenerator["default"].wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.next = 2;
                                      return _db.db.any('SELECT work_id, position FROM worker_work WHERE work_id = $1 AND position = $2', [item.work_id, item.position]);

                                    case 2:
                                      foundItem = _context.sent;
                                      console.log('found %o', foundItem);
                                      isDuplicateFound = foundItem.length > 0;
                                      console.log('foundItem size: ', foundItem.length);
                                      return _context.abrupt("return", foundItem);

                                    case 7:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _callee);
                            }));

                            return function (_x) {
                              return _ref2.apply(this, arguments);
                            };
                          }());
                          _context2.next = 4;
                          return Promise.all(promises);

                        case 4:
                          if (isDuplicateFound) {
                            res.status(409).json({
                              status: 'Conflict',
                              message: 'Kerjaan sudah pernah disimpan'
                            });
                          }

                          return _context2.abrupt("return", isDuplicateFound);

                        case 6:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function foundDuplicate() {
                  return _ref.apply(this, arguments);
                };
              }();

              _context3.next = 3;
              return foundDuplicate();

            case 3:
              if (_context3.sent) {
                _context3.next = 6;
                break;
              }

              query = pgp.helpers.insert(req.body, ['worker_id', 'work_id', 'position', 'created_at'], 'worker_work') + 'RETURNING *';

              _db.db.tx('assign-works', function (t) {
                return t.map(query, [], function (row) {
                  // console.log(row);
                  var flagColumn = getDbPositionKey(row.position); // console.log('FLAGCOLUMN:', flagColumn);

                  var mQuery = "UPDATE work SET ".concat(flagColumn, " = true WHERE work_id = $1");
                  return t.none(mQuery, row.work_id);
                }).then(t.batch);
              }).then(function () {
                res.status(201).json({
                  status: 'Created',
                  message: 'Kerjaan berhasil ditambahkan ke tukang'
                });
              })["catch"](function (error) {
                return next(error);
              });

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  getAll: function getAll(req, res, next) {
    // filter by done date, created_at, position
    // sort by spk_no, created_at, done date, article_no
    // search spk_no, article_no
    var searchKeyword = typeof req.query.search_keyword === 'undefined' ? '' : req.query.search_keyword;
    searchKeyword = "%".concat(searchKeyword, "%");
    var workerId = typeof req.params.worker_id === 'undefined' ? null : req.params.worker_id;
    var page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    var limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;
    var offset = (page - 1) * limit;
    var getWorkerWorkQuery = 'SELECT *, worker_work.created_at AS done_at, work.created_at FROM worker_work JOIN work ON worker_work.work_id = work.work_id JOIN product ON work.product_id = product.product_id WHERE worker_id = $1';
    var countWorkerWorkQuery = 'SELECT COUNT(*) FROM worker_work JOIN work ON worker_work.work_id = work.work_id JOIN product ON work.product_id = product.product_id WHERE worker_id = $1';

    var addDateFilter = function addDateFilter(dateType) {
      if (dateType === 'done_at') {
        getWorkerWorkQuery += ' AND worker_work.created_at BETWEEN $4 AND $5';
        countWorkerWorkQuery += ' AND worker_work.created_at BETWEEN $2 AND $3';
      } else if (dateType === 'created_at') {
        getWorkerWorkQuery += ' AND work.created_at BETWEEN $4 AND $5';
        countWorkerWorkQuery += ' AND work.created_at BETWEEN $2 AND $3';
      }
    };

    var addSearchFilter = function addSearchFilter() {
      getWorkerWorkQuery += ' AND (spk_no::text LIKE $6 OR article_no::text LIKE $6)';
      countWorkerWorkQuery += ' AND (spk_no::text LIKE $4 OR article_no::text LIKE $4)';
    };

    var addPositionFilter = function addPositionFilter() {
      if (typeof req.query.position !== 'undefined') {
        getWorkerWorkQuery += ' AND position = $7';
        countWorkerWorkQuery += ' AND position = $5';
      }
    };

    var addSortBy = function addSortBy(sortKey) {
      switch (sortKey) {
        case 'spk_no':
          getWorkerWorkQuery += ' ORDER BY spk_no';
          break;

        case 'article_no':
          getWorkerWorkQuery += ' ORDER BY article_no';
          break;

        case 'created_at':
          getWorkerWorkQuery += ' ORDER BY work.created_at';
          break;

        case 'done_at':
          getWorkerWorkQuery += ' ORDER BY worker_work.created_at';
          break;

        default:
          getWorkerWorkQuery += ' ORDER BY spk_no';
          break;
      }
    };

    var addSortDirection = function addSortDirection(direction) {
      switch (direction) {
        case 'asc':
          getWorkerWorkQuery += ' ASC';
          break;

        case 'desc':
          getWorkerWorkQuery += ' DESC';
          break;

        default:
          getWorkerWorkQuery += ' ASC';
          break;
      }
    };

    var addPagination = function addPagination() {
      getWorkerWorkQuery += ' LIMIT $2 OFFSET $3';
    };

    addDateFilter(req.query.date_filter_type);
    addSearchFilter();
    addPositionFilter();
    addSortBy(req.query.sort_by);
    addSortDirection(req.query.sort_direction);
    addPagination();

    _db.db.task( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
        var endDate, list, meta;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // console.log(getWorkerWorkQuery);
                // console.log(countWorkerWorkQuery);
                endDate = req.query.end_date;
                endDate = "".concat(endDate, "T23:59:59.000");
                _context4.next = 4;
                return t.any(getWorkerWorkQuery, [workerId, limit, offset, req.query.start_date, endDate, searchKeyword, req.query.position]);

              case 4:
                list = _context4.sent;
                _context4.next = 7;
                return t.one(countWorkerWorkQuery, [workerId, req.query.start_date, endDate, searchKeyword, req.query.position]);

              case 7:
                meta = _context4.sent;
                return _context4.abrupt("return", {
                  list: list,
                  meta: meta
                });

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }()).then(function (result) {
      var totalRow = result.meta.count;
      var totalPage = 1;

      if (limit !== null) {
        totalPage = Math.ceil(totalRow / limit);
      }

      res.status(200).json({
        status: 'OK',
        data: result.list,
        meta: {
          total_page: totalPage
        },
        message: 'Semua kerjaan tukang berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  "delete": function _delete(req, res, next) {
    var workerId = req.query.worker_id;
    var workId = req.query.work_id;
    var position = req.query.position;
    var deleteQuery = 'DELETE FROM worker_work WHERE worker_id = $1 AND work_id = $2 AND position = $3';
    var updateQuery = 'UPDATE work SET $1:raw = false WHERE work_id = $2';

    var taskDelete = /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return _db.db.tx('unassign-work', /*#__PURE__*/function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                    var work, difference, flagColumn;
                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return t.one('SELECT created_at FROM worker_work WHERE worker_id = $1 AND work_id = $2 AND position = $3', [workerId, workId, position]);

                          case 2:
                            work = _context5.sent;
                            difference = _DateUtil["default"].differenceInDays(work.created_at, new Date());
                            console.log('difference: ', difference);

                            if (!(difference <= 1 || req.user.role === _role["default"].SUPERUSER)) {
                              _context5.next = 14;
                              break;
                            }

                            _context5.next = 8;
                            return t.none(deleteQuery, [workerId, workId, position]);

                          case 8:
                            flagColumn = getDbPositionKey(position);
                            _context5.next = 11;
                            return t.none(updateQuery, [flagColumn, workId]);

                          case 11:
                            res.status(200).json({
                              status: 'OK',
                              message: 'Kerjaan berhasil dihapus dari tukang'
                            });
                            _context5.next = 15;
                            break;

                          case 14:
                            res.status(401).json({
                              status: 'Unauthorized',
                              message: 'Menghapus gagal. Batas waktu maksimal 1 hari'
                            });

                          case 15:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x3) {
                    return _ref5.apply(this, arguments);
                  };
                }());

              case 3:
                _context6.next = 8;
                break;

              case 5:
                _context6.prev = 5;
                _context6.t0 = _context6["catch"](0);
                return _context6.abrupt("return", next(_context6.t0));

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 5]]);
      }));

      return function taskDelete() {
        return _ref4.apply(this, arguments);
      };
    }();

    taskDelete();
  }
};
var _default = WorkerWork;
exports["default"] = _default;