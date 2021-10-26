"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _UserQueries = _interopRequireDefault(require("../queries/UserQueries"));

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var router = (0, _express.Router)();
router.post('/', _UserQueries["default"].create);
router.get('/', (0, _Authorize["default"])(_role["default"].SUPERUSER), _UserQueries["default"].getAll);
router["delete"]('/', (0, _Authorize["default"])(_role["default"].SUPERUSER), _UserQueries["default"]["delete"]);
router.post('/authenticate', _UserQueries["default"].authenticate);
router.post('/token', _UserQueries["default"].refreshToken);
router.post('/signout', _UserQueries["default"].signOut);
router.patch('/:id', (0, _Authorize["default"])(_role["default"].SUPERUSER), _UserQueries["default"].changeActiveStatus);
var _default = router;
exports["default"] = _default;