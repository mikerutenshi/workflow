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

var Work = {
  getAll: function getAll(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var searchKeyword, params, result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              searchKeyword = typeof req.query.search_keyword === 'undefined' ? '' : req.query.search_keyword;
              params = {
                start_date: req.query.start_date,
                end_date: "".concat(req.query.end_date, "T23:59:59.000"),
                search_keyword: "%".concat(searchKeyword, "%"),
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit
              };
              _context.prev = 2;
              _context.next = 5;
              return _db.db.one(_sql.workV1.getAll, params);

            case 5:
              result = _context.sent;
              return _context.abrupt("return", res.status(200).json({
                status: 'OK',
                data: result.data,
                meta: {
                  total_page: result.total_page
                },
                message: 'Semua Kerjaan berhasil diload'
              }));

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](2);
              return _context.abrupt("return", next(_context.t0));

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 9]]);
    }))();
  },
  getOneWorkerWork: function getOneWorkerWork(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var params, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              params = {
                id: req.params.id,
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit
              };
              _context2.prev = 1;
              _context2.next = 4;
              return _db.db.one(_sql.workV1.getOneWorkerWork, params);

            case 4:
              result = _context2.sent;
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                data: result.data,
                meta: {
                  total_page: result.total_page
                },
                message: 'Semua detail kerjaan selesai berhasil diload'
              }));

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", next(_context2.t0));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 8]]);
    }))();
  },
  getOneAssignedWork: function getOneAssignedWork(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var params, result;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              params = {
                id: req.params.id,
                sort_by: req.query.sort_by,
                sort_direction: req.query.sort_direction,
                limit: req.query.limit,
                offset: (req.query.page - 1) * req.query.limit
              };
              _context3.prev = 1;
              _context3.next = 4;
              return _db.db.one(_sql.workV1.getOneAssignedWork, params);

            case 4:
              result = _context3.sent;
              return _context3.abrupt("return", res.status(200).json({
                status: 'OK',
                data: result.data,
                meta: {
                  total_page: result.total_page
                },
                message: 'Semua detail sedang dikerjakan berhasil diload'
              }));

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](1);
              return _context3.abrupt("return", next(_context3.t0));

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 8]]);
    }))();
  }
};
var _default = Work;
exports["default"] = _default;