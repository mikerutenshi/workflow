"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var authorize = function authorize() {
  var roles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (typeof roles === 'string') {
    roles = [roles];
  }

  var secret = process.env.SECRET;
  return [(0, _expressJwt["default"])(secret), function (req, res, next) {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'Tidak memiliki akses'
      });
    }

    next();
  }];
};

var _default = authorize;
exports["default"] = _default;