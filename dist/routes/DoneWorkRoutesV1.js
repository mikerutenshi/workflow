"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _DoneWorkQueriesV = _interopRequireDefault(require("../queries/DoneWorkQueriesV1"));

var router = (0, _express.Router)();
var doneableRouter = (0, _express.Router)({
  mergeParams: true
});
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _DoneWorkQueriesV["default"].create);
router.get('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _DoneWorkQueriesV["default"].getAll);
router["delete"]('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), _DoneWorkQueriesV["default"]["delete"]);
router.use('/:id/doneables', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE, _role["default"].ADMIN_WORK, _role["default"].ADMIN_QA]), doneableRouter);
doneableRouter.get('/', _DoneWorkQueriesV["default"].getDonables);
var _default = router;
exports["default"] = _default;