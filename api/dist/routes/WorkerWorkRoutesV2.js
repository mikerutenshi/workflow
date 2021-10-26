"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _WorkerWorkQueriesV = _interopRequireDefault(require("../queries/WorkerWorkQueriesV2"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _WorkerWorkQueriesV["default"].create);
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _WorkerWorkQueriesV["default"].getAll);
router["delete"]('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _WorkerWorkQueriesV["default"]["delete"]);
var _default = router;
exports["default"] = _default;