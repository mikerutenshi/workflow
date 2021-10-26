"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _WorkQueriesV = _interopRequireDefault(require("../queries/WorkQueriesV1"));

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var workRouter = (0, _express.Router)();
var workerWorkRouter = (0, _express.Router)({
  mergeParams: true
});
var assignedWorkRouter = (0, _express.Router)({
  mergeParams: true
});
workRouter.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _WorkQueriesV["default"].getAll);
workRouter.use('/:id/done-work', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), workerWorkRouter);
workRouter.use('/:id/assigned-work', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), assignedWorkRouter);
workerWorkRouter.get('/', _WorkQueriesV["default"].getOneWorkerWork);
assignedWorkRouter.get('/', _WorkQueriesV["default"].getOneAssignedWork);
var _default = workRouter;
exports["default"] = _default;