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

var LabourCost = {
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _db.db.none(_sql.labourCost.create, req.body);

            case 3:
              return _context.abrupt("return", res.status(201).json({
                status: 'Created',
                message: 'Ongkos tukang berhasil ditambahkan'
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
  // only update product specific data
  update: function update(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var params;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              params = {
                id: req.params.id,
                cost: req.body.cost
              };
              _context2.prev = 1;
              _context2.next = 4;
              return _db.db.none(_sql.labourCost.update, params);

            case 4:
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Data ongkos tukang berhasil dirubah'
              }));

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", next(_context2.t0));

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 7]]);
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
              return _db.db.none(_sql.labourCost["delete"], [req.params.id]);

            case 3:
              return _context3.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Ongkos tukang berhasil dihapus'
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
  }
};
var _default = LabourCost;
exports["default"] = _default;