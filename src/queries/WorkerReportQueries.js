import { db } from '../db';
import { workerReport } from '../sql';

const WorkerReport = {
  getReport(req, res, next) {
    const startDate = req.query.start_date;
    let endDate = req.query.end_date;
    endDate = `${endDate}T23:59:59.000`;
    db.task('get-report', (t) => {
      return t.batch([
        t.none(workerReport.view, [startDate, endDate]),
        t.any(workerReport.report),
        t.one(workerReport.sum),
        t.one(workerReport.sumQty, [startDate, endDate])
      ]);
    })
      .then((d) => {
        const totalCost = d[2].sum;
        const totalQty = d[3].sum;
        const data = {
          list: d[1],
          sum: {
            total_cost: totalCost,
            total_quantity: totalQty
          }
        };
        res.status(200)
          .json({
            status: 'OK',
            data,
            message: 'Semua biaya tukang berhasil diload'
          });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getWorkDetail(req, res, next) {
    const workerId = req.params.worker_id;
    const startDate = req.query.start_date;
    let endDate = req.query.end_date;
    endDate = `${endDate}T23:59:59.000`;
    db.any(workerReport.getWorkDetail, [workerId, startDate, endDate, req.query.position])
      .then((data) => {
        res.status(200)
          .json({
            status: 'OK',
            data,
            message: 'Semua detil biaya tukang berhasil diload'
          });
      })
      .catch((err) => {
        return next(err);
      });
  }
};

export default WorkerReport;
