"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var DateUtil = {
  addDays: function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  addMinute: function addMinute(date, minutes) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  },
  differenceInDays: function differenceInDays(a, b) {
    var MS_PER_DAY = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor(Math.abs(utc2 - utc1) / MS_PER_DAY);
  }
};
var _default = DateUtil;
exports["default"] = _default;