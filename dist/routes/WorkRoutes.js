"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _WorkQueries = _interopRequireDefault(require("../queries/WorkQueries"));

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _WorkQueries["default"].create);
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _WorkQueries["default"].getAll);
router.get('/:worker_id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _WorkQueries["default"].getPerWorker);
router.get('/unassigned/:worker_id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _WorkQueries["default"].getUnassigned);
router["delete"]('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _WorkQueries["default"]["delete"]);
router.put('/:work_id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _WorkQueries["default"].update);
var _default = router;
exports["default"] = _default;