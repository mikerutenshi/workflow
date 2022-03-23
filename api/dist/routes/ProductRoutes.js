"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _Authorize = _interopRequireDefault(require("../middleware/Authorize"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _ProductQueries = _interopRequireDefault(require("../queries/ProductQueries"));

var router = (0, _express.Router)();

var dirPath = _path["default"].resolve(__dirname, '../../temp/');

var upload = (0, _multer["default"])({
  dest: dirPath
});
router.post('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _ProductQueries["default"].create);
router.get('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _ProductQueries["default"].getAll);
router["delete"]('/', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _ProductQueries["default"]["delete"]);
router.put('/:product_id', (0, _Authorize["default"])([_role["default"].SUPERUSER, _role["default"].ADMIN_PRICE]), _ProductQueries["default"].update);
router.get('/export-csv', (0, _Authorize["default"])([_role["default"].SUPERUSER]), _ProductQueries["default"].exportCsv);
router.post('/import-csv', (0, _Authorize["default"])([_role["default"].SUPERUSER]), upload.single('product_import'), _ProductQueries["default"].importCsv);
router.post('/import-csv-update', (0, _Authorize["default"])([_role["default"].SUPERUSER]), upload.single('product_import'), _ProductQueries["default"].importCsvUpdate);
var _default = router;
exports["default"] = _default;