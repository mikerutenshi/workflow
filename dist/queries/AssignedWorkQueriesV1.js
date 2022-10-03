"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sql = require("../sql");

var _db = require("../db");

var _position = _interopRequireDefault(require("../helpers/position"));

var AssignedWork = {
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (typeof req.body.notes === 'undefined') {
                req.body.notes = null;
              }

              _context.next = 4;
              return _db.db.none(_sql.assignedWorkV1.create, req.body);

            case 4:
              return _context.abrupt("return", res.status(201).json({
                status: 'Created',
                message: 'Kerjaan berhasil diberikan'
              }));

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", next(_context.t0));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 7]]);
    }))();
  },
  getAll: function getAll(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var dateType, searchKeyword, positionExpression, params, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dateType = null;
              _context2.t0 = req.query.date_filter_type;
              _context2.next = _context2.t0 === 'created_at' ? 4 : _context2.t0 === 'assigned_at' ? 6 : 4;
              break;

            case 4:
              dateType = 'work.created_at';
              return _context2.abrupt("break", 8);

            case 6:
              dateType = 'assigned_work.assigned_at';
              return _context2.abrupt("break", 8);

            case 8:
              searchKeyword = typeof req.query.search_keyword === 'undefined' ? '' : req.query.search_keyword;
              positionExpression = null;

              if (typeof req.query.position === 'undefined') {
                positionExpression = _db.pgp.as.format('');
              } else {
                positionExpression = _db.pgp.as.format('and position = $1', [req.query.position]);
              }

              params = {
                worker_id: req.params.id,
                date_filter_type: dateType,
                start_date: req.query.start_date,
                end_date: "".concat(req.query.end_date, "T23:59:59.000"),
                search_keyword: "%".concat(searchKeyword, "%"),
                position_expression: positionExpression,
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit
              };
              _context2.prev = 12;
              _context2.next = 15;
              return _db.db.one(_sql.assignedWorkV1.getAll, params);

            case 15:
              result = _context2.sent;
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                data: result.data == null ? [] : result.data,
                meta: {
                  total_page: Math.ceil(result.count / req.query.limit)
                },
                message: 'Semua kerjaan yang dikerjakan berhasil diload'
              }));

            case 19:
              _context2.prev = 19;
              _context2.t1 = _context2["catch"](12);
              return _context2.abrupt("return", next(_context2.t1));

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[12, 19]]);
    }))();
  },
  "delete": function _delete(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _db.db.none(_sql.assignedWorkV1["delete"], req.params);

            case 3:
              return _context3.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Pengerjaan berhasil dibatalkan'
              }));

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", next(_context3.t0));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 6]]);
    }))();
  },
  getAssignables: function getAssignables(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var searchKeyword, priceColumn, params, result;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              searchKeyword = typeof req.query.search_keyword === 'undefined' ? '' : req.query.search_keyword;
              priceColumn = '';
              _context4.t0 = req.query.position;
              _context4.next = _context4.t0 === _position["default"].DRAWER ? 5 : _context4.t0 === _position["default"].SEWER ? 7 : _context4.t0 === _position["default"].ASSEMBLER ? 9 : _context4.t0 === _position["default"].SOLE_STITCHER ? 11 : _context4.t0 === _position["default"].LINING_DRAWER ? 13 : _context4.t0 === _position["default"].INSOLE_STITCHER ? 15 : 11;
              break;

            case 5:
              priceColumn = 'product.drawing_cost';
              return _context4.abrupt("break", 17);

            case 7:
              priceColumn = 'product.sewing_cost';
              return _context4.abrupt("break", 17);

            case 9:
              priceColumn = 'product.assembling_cost';
              return _context4.abrupt("break", 17);

            case 11:
              priceColumn = 'product.sole_stitching_cost';
              return _context4.abrupt("break", 17);

            case 13:
              priceColumn = 'product.lining_drawing_cost';
              return _context4.abrupt("break", 17);

            case 15:
              priceColumn = 'product.insole_stitching_cost';
              return _context4.abrupt("break", 17);

            case 17:
              params = {
                start_date: req.query.start_date,
                end_date: "".concat(req.query.end_date, "T23:59:59.000"),
                search_keyword: "%".concat(searchKeyword, "%"),
                position: req.query.position,
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit,
                price_column: priceColumn
              };
              _context4.prev = 18;
              _context4.next = 21;
              return _db.db.one(_sql.assignedWorkV1.getAssignables, params);

            case 21:
              result = _context4.sent;
              return _context4.abrupt("return", res.status(200).json({
                status: 'OK',
                data: result.data == null ? [] : result.data,
                meta: {
                  total_page: Math.ceil(result.count / req.query.limit)
                },
                message: 'Semua kerjaan yang bisa diberikan berhasil diload'
              }));

            case 25:
              _context4.prev = 25;
              _context4.t1 = _context4["catch"](18);
              return _context4.abrupt("return", next(_context4.t1));

            case 28:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[18, 25]]);
    }))();
  }
};
var _default = AssignedWork;
exports["default"] = _default;