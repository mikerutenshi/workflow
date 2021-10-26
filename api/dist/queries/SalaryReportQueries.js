"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _db = require("../db");

var _sql = require("../sql");

var SalaryReport = {
  getAll: function getAll(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var params, result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              params = {
                start_date: req.query.start_date,
                end_date: "".concat(req.query.end_date, "T23:59:59.000"),
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit
              };
              _context.prev = 1;
              _context.next = 4;
              return _db.db.one(_sql.salaryReport.getAll, params);

            case 4:
              result = _context.sent;
              return _context.abrupt("return", res.status(200).json({
                status: 'OK',
                data: {
                  quantities: result.quantities,
                  total_cost: result.total_cost,
                  list: result.list
                },
                meta: {
                  total_page: result.total_page
                },
                message: 'Semua upah tukang berhasil diload'
              }));

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              return _context.abrupt("return", next(_context.t0));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 8]]);
    }))();
  },
  getOne: function getOne(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var positionExpression, params, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              positionExpression = null;

              if (typeof req.query.position === 'undefined') {
                positionExpression = _db.pgp.as.format('');
              } else {
                positionExpression = _db.pgp.as.format('and position = $1', [req.query.position]);
              }

              params = {
                worker_id: req.params.id,
                start_date: req.query.start_date,
                end_date: "".concat(req.query.end_date, "T23:59:59.000"),
                position_expression: positionExpression,
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit
              };
              _context2.prev = 3;
              _context2.next = 6;
              return _db.db.one(_sql.salaryReport.getOne, params);

            case 6:
              result = _context2.sent;
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                data: {
                  total_cost: result.total_cost,
                  total_quantity: result.total_quantity,
                  list: result.data
                },
                meta: {
                  total_page: result.total_page
                },
                message: 'Detail upah tukang berhasil diload'
              }));

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](3);
              return _context2.abrupt("return", next(_context2.t0));

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[3, 10]]);
    }))();
  }
};
var _default = SalaryReport;
exports["default"] = _default;