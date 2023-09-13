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

var Work = {
  create: function create(req, res, next) {
    if (typeof req.body.notes === 'undefined') {
      req.body.notes = null;
    }

    _db.db.manyOrNone('SELECT * FROM work WHERE spk_no = $1', req.body.spk_no).then(function (result) {
      if (result.length == 0) {
        _db.db.none('INSERT INTO work(spk_no, product_id, product_quantity, notes) VALUES(${spk_no}, ${product_id}, ${product_quantity}, ${notes})', req.body).then(function () {
          res.status(201).json({
            status: 'Created',
            message: 'Kerjaan berhasil dibuat'
          });
        })["catch"](function (err) {
          return next(err);
        });
      } else {
        var work = result[0];
        var conflictError = new Error("SPK No. ".concat(work.spk_no, " sudah pernah di-input"));
        conflictError.code = 409;
        return next(conflictError);
      }
    })["catch"](function (err) {
      return next(err);
    }); // db.none(
    //   'INSERT INTO work(spk_no, product_id, product_quantity, notes) VALUES(${spk_no}, ${product_id}, ${product_quantity}, ${notes})',
    //   req.body,
    // )
    //   .then(() => {
    //     res.status(201).json({
    //       status: 'Created',
    //       message: 'Kerjaan berhasil dibuat',
    //     });
    //   })
    //   .catch((err) => {
    //     return next(err);
    //   });

  },
  getAll: function getAll(req, res, next) {
    var spkNo = typeof req.query.spk_no === 'undefined' ? '' : req.query.spk_no;
    var filter = "%".concat(spkNo, "%");
    var page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    var limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;
    var offset = (page - 1) * limit;

    _db.db.task( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
        var list, meta;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return t.any('SELECT *, work.created_at, work.updated_at FROM work JOIN product ON product.product_id = work.product_id WHERE spk_no::text LIKE $1 OR article_no::text LIKE $1 ORDER BY spk_no LIMIT $2 OFFSET $3', [filter, limit, offset]);

              case 2:
                list = _context.sent;
                _context.next = 5;
                return t.one('SELECT COUNT(*) FROM work JOIN product ON product.product_id = work.product_id WHERE spk_no::text LIKE $1 OR article_no::text LIKE $1', filter);

              case 5:
                meta = _context.sent;
                return _context.abrupt("return", {
                  list: list,
                  meta: meta
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
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
        message: 'Semua kerjaan berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  getUnassigned: function getUnassigned(req, res, next) {
    var spkNo = typeof req.query.spk_no === 'undefined' ? '' : req.query.spk_no;
    var filter = "%".concat(spkNo, "%");
    var page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    var limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;
    var offset = (page - 1) * limit;
    var position = typeof req.query.position === 'undefined' ? null : req.query.position;
    var isDoneColumn;

    switch (position) {
      case 'drawer':
        isDoneColumn = 'is_drawn';
        break;

      case 'sewer':
        isDoneColumn = 'is_sewn';
        break;

      case 'assembler':
        isDoneColumn = 'is_assembled';
        break;

      case 'sole_stitcher':
        isDoneColumn = 'is_sole_stitched';
        break;

      case 'lining_drawer':
        isDoneColumn = 'is_lining_drawn';
        break;

      case 'insole_stitcher':
        isDoneColumn = 'is_insole_stitched';
        break;

      default:
        break;
    }

    var listQuery = 'SELECT *, work.created_at FROM work JOIN product ON product.product_id = work.product_id WHERE $1:raw = false AND (spk_no::text LIKE $2 OR article_no::text LIKE $2)';
    var sumQuery = 'SELECT COUNT(*) FROM work JOIN product ON product.product_id = work.product_id WHERE $1:raw = false AND (spk_no::text LIKE $2 OR article_no::text LIKE $2)';

    var addSortBy = function addSortBy(sortBy) {
      if (sortBy === 'spk_no') {
        listQuery += ' ORDER BY spk_no';
      } else if (sortBy === 'article_no') {
        listQuery += ' ORDER BY article_no';
      } else if (sortBy === 'created_at') {
        listQuery += ' ORDER BY work.created_at';
      } else {
        listQuery += ' ORDER BY spk_no';
      }
    };

    var addSortDirection = function addSortDirection(sortDirection) {
      if (sortDirection === 'asc') {
        listQuery += ' ASC';
      } else if (sortDirection === 'desc') {
        listQuery += ' DESC';
      } else {
        listQuery += ' ASC';
      }
    };

    var addPagination = function addPagination() {
      listQuery += ' LIMIT $3 OFFSET $4';
    };

    if (position === _position["default"].SOLE_STITCHER) {
      listQuery += ' AND product.sole_stitching_cost != 0';
    } else if (position === _position["default"].INSOLE_STITCHER) {
      listQuery += ' AND product.insole_stitching_cost != 0';
    }

    _db.db.task('get-unassigned_work', /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
        var list, sum, endDate;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof req.query.start_date !== 'undefined' && typeof req.query.end_date !== 'undefined')) {
                  _context2.next = 16;
                  break;
                }

                listQuery += ' AND work.created_at BETWEEN $5 AND $6';
                sumQuery += ' AND work.created_at BETWEEN $3 AND $4';
                addSortBy(req.query.sort_by);
                addSortDirection(req.query.sort_direction);
                addPagination();
                endDate = req.query.end_date;
                endDate = "".concat(endDate, "T23:59:59.000");
                _context2.next = 10;
                return t.any(listQuery, [isDoneColumn, filter, limit, offset, req.query.start_date, endDate]);

              case 10:
                list = _context2.sent;
                _context2.next = 13;
                return t.one(sumQuery, [isDoneColumn, filter, req.query.start_date, endDate]);

              case 13:
                sum = _context2.sent;
                _context2.next = 25;
                break;

              case 16:
                addSortBy(req.query.sort_by);
                addSortDirection(req.query.sort_direction);
                addPagination();
                _context2.next = 21;
                return t.any(listQuery, [isDoneColumn, filter, limit, offset]);

              case 21:
                list = _context2.sent;
                _context2.next = 24;
                return t.one(sumQuery, [isDoneColumn, filter]);

              case 24:
                sum = _context2.sent;

              case 25:
                return _context2.abrupt("return", {
                  list: list,
                  sum: sum
                });

              case 26:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }()).then(function (result) {
      var totalRow = result.sum.count;
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
        message: 'Semua kerjaan difilter belum dikerjakan per tukang dan posisi berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  getPerWorker: function getPerWorker(req, res, next) {
    var workerId = typeof req.params.worker_id === 'undefined' ? null : req.params.worker_id;
    var spkNo = typeof req.query.spk_no === 'undefined' ? '' : req.query.spk_no;
    var filter = "%".concat(spkNo, "%");
    var page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    var limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;
    var offset = (page - 1) * limit;

    _db.db.task('get_work-per_worker', /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
        var list, sum;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return t.any('SELECT * FROM work JOIN worker_work ON work.work_id = worker_work.work_id JOIN product ON product.product_id = work.product_id WHERE worker_id = $1 AND spk_no::text LIKE $2 ORDER BY spk_no LIMIT $3 OFFSET $4', [workerId, filter, limit, offset]);

              case 2:
                list = _context3.sent;
                _context3.next = 5;
                return t.one('SELECT COUNT(*) FROM work JOIN worker_work ON work.work_id = worker_work.work_id JOIN product ON product.product_id = work.product_id WHERE worker_id = $1 AND spk_no::text LIKE $2', [workerId, filter]);

              case 5:
                sum = _context3.sent;
                return _context3.abrupt("return", {
                  list: list,
                  sum: sum
                });

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }()).then(function (result) {
      var totalRow = result.sum.count;
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
        message: 'Semua kerjaan difilter berdasarkan worker_id berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  "delete": function _delete(req, res, next) {
    var workId = req.query.work_id;

    _db.db.none('DELETE FROM work WHERE work_id in ($1:csv)', [workId]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Kerjaan berhasil dihapus'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  update: function update(req, res, next) {
    var notes = typeof req.body.notes === 'undefined' ? null : req.body.notes;

    _db.db.none('UPDATE work SET spk_no = $1, product_id = $2, product_quantity = $3, notes = $4, updated_at = now() WHERE work_id = $5', [req.body.spk_no, req.body.product_id, req.body.product_quantity, notes, req.params.work_id]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Kerjaan berhasil diubah'
      });
    })["catch"](function (err) {
      return next(err);
    });
  }
};
var _default = Work;
exports["default"] = _default;