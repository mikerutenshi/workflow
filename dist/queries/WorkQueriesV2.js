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

var WorkV2 = {
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _db.db.tx( /*#__PURE__*/function () {
                var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(t) {
                  var createdWork;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return t.one(_sql.work.create, req.body);

                        case 2:
                          createdWork = _context2.sent;
                          req.body.products.map( /*#__PURE__*/function () {
                            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(product) {
                              return _regenerator["default"].wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.prev = 0;
                                      _context.next = 3;
                                      return t.none(_sql.workPurchaseOrderProduct.create, {
                                        work_id: createdWork.work_id,
                                        purchase_order_id: product.purchase_order_id,
                                        product_id: product.product_id,
                                        color_id: product.color_id,
                                        size_id: product.size_id,
                                        quantity: product.quantity
                                      });

                                    case 3:
                                      return _context.abrupt("return", _context.sent);

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
                            }));

                            return function (_x2) {
                              return _ref2.apply(this, arguments);
                            };
                          }());

                        case 4:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }());

            case 3:
              if (res.headersSent) {
                _context3.next = 5;
                break;
              }

              return _context3.abrupt("return", res.status(201).json({
                status: 'Created',
                message: 'Kerjaan berhasil dibuat'
              }));

            case 5:
              _context3.next = 10;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", next(_context3.t0));

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 7]]);
    }))();
  },
  getPerProduct: function getPerProduct(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var data;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _db.db.any(_sql.work.getPerProduct, req.query);

            case 3:
              data = _context4.sent;
              return _context4.abrupt("return", res.status(200).json({
                status: 'OK',
                data: data,
                message: 'Kerjaan per sepatu berhasil diload'
              }));

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", next(_context4.t0));

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 7]]);
    }))();
  }
};
var _default = WorkV2;
exports["default"] = _default;