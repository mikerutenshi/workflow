"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _AssignedWorkQueriesV = _interopRequireDefault(require("../queries/AssignedWorkQueriesV1"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _AssignedWorkQueriesV["default"].create);
router.get('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _AssignedWorkQueriesV["default"].getAll);
router["delete"]('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _AssignedWorkQueriesV["default"]["delete"]);
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _AssignedWorkQueriesV["default"].getAssignables);
var _default = router;
exports["default"] = _default;