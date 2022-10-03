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

var PurchaseOrderProduct = {
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _db.db.none(_sql.purchaseOrderProduct.create, req.body);

            case 3:
              return _context.abrupt("return", res.status(201).json({
                status: 'Created',
                message: 'Sepatu berhasil ditambahkan ke PO'
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
  // async getAll(req, res, next) {
  //   try {
  //     const data = await db.any(purchaseOrderProduct.getAll);
  //     return res.status(200)
  //       .json({
  //         status: 'OK',
  //         data,
  //         message: 'Semua sepatu dari PO berhasil diload'
  //       });
  //   } catch (err) {
  //     return next(err);
  //   }
  // },
  // async updateColorProduct(req, res, next) {
  //   const params = req.body;
  //   params.purchase_order_id = req.query.purchase_order_id;
  //   params.product_id = req.query.product_id;
  //   params.body_color_id = req.body.color_id;
  //   params.query_color_id = req.query.color_id;
  //   try {
  //     await db.none(purchaseOrderProduct.updateColorProduct, params);
  //     return res.status(200)
  //       .json({
  //         status: 'OK',
  //         message: 'Sepatu dan warna berhasil dirubah'
  //       });
  //   } catch (err) {
  //     return next(err);
  //   }
  // },
  updateQuantity: function updateQuantity(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var params;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              params = req.query;
              params.quantity = req.body.quantity;
              _context2.prev = 2;
              _context2.next = 5;
              return _db.db.none(_sql.purchaseOrderProduct.updateQuantity, params);

            case 5:
              return _context2.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Kuantitas berhasil dirubah'
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
  deleteColorProduct: function deleteColorProduct(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _db.db.none(_sql.purchaseOrderProduct.deleteColorProduct, req.query);

            case 3:
              return _context3.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Sepatu berhasil dihapus dari PO'
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
  deleteSize: function deleteSize(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _db.db.none(_sql.purchaseOrderProduct.deleteSize, req.query);

            case 3:
              return _context4.abrupt("return", res.status(200).json({
                status: 'OK',
                message: 'Ukuran berhasil dihapus dari sepatu'
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
var _default = PurchaseOrderProduct;
exports["default"] = _default;