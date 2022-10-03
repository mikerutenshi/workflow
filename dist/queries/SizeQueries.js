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

var Color = {
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _db.db.none(_sql.size.create, req.body);

            case 3:
              return _context.abrupt("return", res.status(201).json({
                status: 'Created',
                message: 'Ukuran berhasil dibuat'
              }));

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", next(_context.t0));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }))();
  },
  getAll: function getAll(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var data;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _db.db.any(_sql.size.getAll);

            case 3:
              data = _context2.sent;
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                data: data,
                message: 'Semua ukuran berhasil diload'
              }));

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", next(_context2.t0));

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }))();
  },
  update: function update(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var param;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              param = {
                id: req.params.id,
                name: req.body.name
              };
              _context3.prev = 1;
              _context3.next = 4;
              return _db.db.none(_sql.size.update, param);

            case 4:
              return _context3.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Ukuran berhasil dirubah'
              }));

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](1);
              return _context3.abrupt("return", next(_context3.t0));

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 7]]);
    }))();
  },
  "delete": function _delete(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _db.db.none(_sql.size["delete"], req.query);

            case 3:
              return _context4.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Ukuran-ukuran berhasil dihapus'
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
var _default = Color;
exports["default"] = _default;