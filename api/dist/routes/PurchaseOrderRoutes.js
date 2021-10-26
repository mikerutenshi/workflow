"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _PurchaseOrderQueries = _interopRequireDefault(require("../queries/PurchaseOrderQueries"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderQueries["default"].create);
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _PurchaseOrderQueries["default"].getAll);
router.get('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _PurchaseOrderQueries["default"].getOne);
router.put('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderQueries["default"].update);
router["delete"]('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _PurchaseOrderQueries["default"]["delete"]);
var _default = router;
exports["default"] = _default;