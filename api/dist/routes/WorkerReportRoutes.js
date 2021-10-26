"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _WorkerReportQueries = _interopRequireDefault(require("../queries/WorkerReportQueries"));

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var router = (0, _express.Router)();
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _WorkerReportQueries["default"].getReport);
router.get('/:worker_id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _WorkerReportQueries["default"].getWorkDetail);
var _default = router;
exports["default"] = _default;