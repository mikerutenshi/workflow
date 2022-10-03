"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _PurchaseOrderProductQueries = _interopRequireDefault(require("../queries/PurchaseOrderProductQueries"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderProductQueries["default"].create); // router.patch('/color-products', authorize([Role.SUPERUSER]), PurchaseOrderProduct.updateColorProduct);

router.patch('/sizes', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderProductQueries["default"].updateQuantity);
router["delete"]('/color-products', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderProductQueries["default"].deleteColorProduct);
router["delete"]('/sizes', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderProductQueries["default"].deleteSize);
var _default = router;
exports["default"] = _default;