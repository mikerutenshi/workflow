"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _position = _interopRequireDefault(require("./position"));

var GenerateSortKey = {
  workerPosition: function workerPosition(position) {
    switch (position) {
      case _position["default"].DRAWER:
        return '00_upper_drawer';

      case _position["default"].LINING_DRAWER:
        return '01_lining_drawer';

      case _position["default"].SEWER:
        return '02_sewer';

      case _position["default"].ASSEMBLER:
        return '03_assembler';

      case _position["default"].SOLE_STITCHER:
        return '04_sole_stitcher';

      case _position["default"].INSOLE_STITCHER:
        return '05_sole_stitcher';

      default:
        return null;
    }
  }
};
var _default = GenerateSortKey;
exports["default"] = _default;