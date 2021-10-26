"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _ColorProductQueries = _interopRequireDefault(require("../queries/ColorProductQueries"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _ColorProductQueries["default"].create);
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _ColorProductQueries["default"].getAll);
router.put('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _ColorProductQueries["default"].update);
router["delete"]('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _ColorProductQueries["default"]["delete"]);
var _default = router;
exports["default"] = _default;