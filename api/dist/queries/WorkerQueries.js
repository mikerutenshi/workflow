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

var _GenerateSortKey = _interopRequireDefault(require("../helpers/GenerateSortKey"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Worker = {
  create: function create(req, res, next) {
    _db.db.none('INSERT INTO worker(name, position, sort_key_position) VALUES($1, $2::varchar(255)[], $3)', [req.body.name, req.body.position, _GenerateSortKey["default"].workerPosition(req.body.position[0])]).then(function () {
      res.status(201).json({
        status: 'Created',
        message: 'Tukang berhasil dibuat'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  getAll: function getAll(req, res, next) {
    var name = typeof req.query.name === 'undefined' ? '' : req.query.name.toLowerCase();
    var search = "%".concat(name, "%");
    var page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    var limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;
    var listQuery = 'SELECT * FROM worker WHERE (LOWER(name) LIKE $1)';
    var countQuery = 'SELECT COUNT(*) FROM worker WHERE (LOWER(name) LIKE $1)';

    var addPositionFilter = function addPositionFilter(p) {
      switch (p) {
        case _position["default"].DRAWER:
          listQuery += ' \'drawer\' = ANY(position)';
          countQuery += ' \'drawer\' = ANY(position)';
          break;

        case _position["default"].SEWER:
          listQuery += '  \'sewer\' = ANY(position)';
          countQuery += ' \'sewer\' = ANY(position)';
          break;

        case _position["default"].ASSEMBLER:
          listQuery += '  \'assembler\' = ANY(position)';
          countQuery += ' \'assembler\' = ANY(position)';
          break;

        case _position["default"].SOLE_STITCHER:
          listQuery += '  \'sole_stitcher\' = ANY(position)';
          countQuery += ' \'sole_stitcher\' = ANY(position)';
          break;

        case _position["default"].INSOLE_STITCHER:
          listQuery += ' \'insole_stitcher\' = ANY(position)';
          countQuery += ' \'insole_stitcher\' = ANY(position)';
          break;

        case _position["default"].LINING_DRAWER:
          listQuery += ' \'lining_drawer\' = ANY(position)';
          countQuery += ' \'lining_drawer\' = ANY(position)';
          break;

        default:
          break;
      }
    };

    var addSortDirection = function addSortDirection(sortDirection) {
      if (sortDirection === 'asc') {
        listQuery += ' ASC';
      } else if (sortDirection === 'desc') {
        listQuery += ' DESC';
      }
    };

    var addSortBy = function addSortBy(sortBy) {
      if (sortBy === 'position') {
        listQuery += ' ORDER BY sort_key_position';
        addSortDirection(req.query.sort_direction);
        listQuery += ', name';
      } else if (sortBy === 'name') {
        listQuery += 'ORDER BY name';
      }
    };

    var addPagination = function addPagination() {
      listQuery += ' LIMIT $2 OFFSET $3';
    };

    if (typeof req.query.position !== 'undefined') {
      if (req.query.position instanceof Array) {
        var _iterator = _createForOfIteratorHelper(req.query.position),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var pos = _step.value;

            if (req.query.position.indexOf(pos) === 0) {
              listQuery += ' AND (';
              countQuery += ' AND (';
            } else {
              listQuery += ' OR';
              countQuery += ' OR';
            }

            addPositionFilter(pos);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        listQuery += ' AND (';
        countQuery += ' AND (';
        addPositionFilter(req.query.position);
      }

      listQuery += ')';
      countQuery += ')';

      if (typeof req.query.sort_by !== 'undefined' && typeof req.query.sort_direction !== 'undefined') {
        addSortBy(req.query.sort_by);
      }

      if (typeof req.query.sort_direction !== 'undefined' && req.query.sort_by === 'name') {
        addSortDirection(req.query.sort_direction);
      }

      addPagination();
    } else {
      if (typeof req.query.sort_by !== 'undefined') {
        addSortBy(req.query.sort_by);
      }

      if (typeof req.query.sort_direction !== 'undefined' && req.query.sort_by === 'name') {
        addSortDirection(req.query.sort_direction);
      }

      addPagination();
    }

    var getAllWorkers = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var dataObject, totalRow, totalPage;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _db.db.task( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                    var list, count;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return t.any(listQuery, [search, limit, (page - 1) * limit]);

                          case 2:
                            list = _context.sent;
                            _context.next = 5;
                            return t.one(countQuery, search);

                          case 5:
                            count = _context.sent;
                            return _context.abrupt("return", {
                              list: list,
                              count: count
                            });

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

              case 3:
                dataObject = _context2.sent;
                totalRow = dataObject.count.count;
                totalPage = 1;

                if (limit !== null) {
                  totalPage = Math.ceil(totalRow / limit);
                }

                return _context2.abrupt("return", res.status(200).json({
                  status: 'OK',
                  data: dataObject.list,
                  meta: {
                    total_page: totalPage,
                    total_row: totalRow
                  },
                  message: 'Semua tukang berhasil diload'
                }));

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", next(_context2.t0));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 10]]);
      }));

      return function getAllWorkers() {
        return _ref.apply(this, arguments);
      };
    }();

    getAllWorkers();
  },
  "delete": function _delete(req, res, next) {
    var workerId = req.query.worker_id;

    _db.db.none('DELETE FROM worker WHERE worker_id IN ($1:csv)', [workerId]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Tukang berhasil dihapus'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  update: function update(req, res, next) {
    _db.db.none('UPDATE worker SET name = $1, position = $2::varchar(255)[], updated_at = now(), sort_key_position = $4 WHERE worker_id = $3', [req.body.name, req.body.position, req.params.worker_id, _GenerateSortKey["default"].workerPosition(req.body.position[0])]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Tukang berhasil diubah'
      });
    })["catch"](function (err) {
      return next(err);
    });
  }
};
var _default = Worker;
exports["default"] = _default;