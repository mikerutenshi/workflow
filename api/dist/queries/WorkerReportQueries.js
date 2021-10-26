"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = require("../db");

var _sql = require("../sql");

var WorkerReport = {
  getReport: function getReport(req, res, next) {
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    endDate = "".concat(endDate, "T23:59:59.000");

    _db.db.task('get-report', function (t) {
      return t.batch([t.none(_sql.workerReport.view, [startDate, endDate]), t.any(_sql.workerReport.report), t.one(_sql.workerReport.sum), t.one(_sql.workerReport.sumQty, [startDate, endDate])]);
    }).then(function (d) {
      var totalCost = d[2].sum;
      var totalQty = d[3].sum;
      var data = {
        list: d[1],
        sum: {
          total_cost: totalCost,
          total_quantity: totalQty
        }
      };
      res.status(200).json({
        status: 'OK',
        data: data,
        message: 'Semua biaya tukang berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  getWorkDetail: function getWorkDetail(req, res, next) {
    var workerId = req.params.worker_id;
    var startDate = req.query.start_date;
    var endDate = req.query.end_date;
    endDate = "".concat(endDate, "T23:59:59.000");

    _db.db.any(_sql.workerReport.getWorkDetail, [workerId, startDate, endDate, req.query.position]).then(function (data) {
      res.status(200).json({
        status: 'OK',
        data: data,
        message: 'Semua detil biaya tukang berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  }
};
var _default = WorkerReport;
exports["default"] = _default;