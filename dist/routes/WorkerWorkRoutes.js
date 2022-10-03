"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _WorkerWorkQueries = _interopRequireDefault(require("../queries/WorkerWorkQueries"));

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var router = (0, _express.Router)(); // router.post('/', authorize([Role.SUPERUSER, Role.ADMIN_WORK, Role.ADMIN_QA]), WorkerWork.create);

router.get('/:worker_id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _WorkerWorkQueries["default"].getAll);
router["delete"]('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _WorkerWorkQueries["default"]["delete"]);
var _default = router;
exports["default"] = _default;