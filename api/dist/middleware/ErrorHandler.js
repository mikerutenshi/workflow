"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var ErrorHandler = function ErrorHandler(err, req, res, next) {
  if (typeof err === 'string') {
    return res.status(400).json({
      message: err
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: err.message
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      status: 'Conflict',
      message: 'Tidak dapat menyimpan duplikat artikel'
    });
  }

  return res.status(500).json({
    message: err.message
  });
};

var _default = ErrorHandler;
exports["default"] = _default;