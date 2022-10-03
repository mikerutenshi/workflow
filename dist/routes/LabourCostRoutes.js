"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _LabourCostQueries = _interopRequireDefault(require("../queries/LabourCostQueries"));

var router = (0, _express.Router)();
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _LabourCostQueries["default"].create);
router.patch('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _LabourCostQueries["default"].update);
router["delete"]('/:id', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _LabourCostQueries["default"]["delete"]);
var _default = router;
exports["default"] = _default;