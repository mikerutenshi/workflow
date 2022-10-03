import { db, pgp } from '../db';
import { salaryReport } from '../sql';

const SalaryReport = {
  async getAll(req, res, next) {
    const params = {
      start_date: req.query.start_date,
      end_date: `${req.query.end_date}T23:59:59.000`,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
    };
    try {
      const result = await db.one(salaryReport.getAll, params);
      return res.status(200).json({
        status: 'OK',
        data: {
          quantities: result.quantities,
          total_cost: result.total_cost,
          list: result.list,
        },
        meta: {
          total_page: result.total_page,
        },
        message: 'Semua upah tukang berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
  async getOne(req, res, next) {
    let positionExpression = null;
    if (typeof req.query.position === 'undefined') {
      positionExpression = pgp.as.format('');
    } else {
      positionExpression = pgp.as.format('and position = $1', [
        req.query.position,
      ]);
    }

    const params = {
      worker_id: req.params.id,
      start_date: req.query.start_date,
      end_date: `${req.query.end_date}T23:59:59.000`,
      position_expression: positionExpression,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
    };
    try {
      const result = await db.one(salaryReport.getOne, params);
      return res.status(200).json({
        status: 'OK',
        data: {
          total_cost: result.total_cost,
          total_quantity: result.total_quantity,
          list: result.data,
        },
        meta: {
          total_page: result.total_page,
        },
        message: 'Detail upah tukang berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default SalaryReport;
