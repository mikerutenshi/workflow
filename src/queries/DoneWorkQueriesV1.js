import { doneWorkV1 } from '../sql';
import { db, pgp } from '../db';

const DoneWork = {
  async create(req, res, next) {
    try {
      if (typeof req.body.notes === 'undefined') {
        req.body.notes = null;
      }

      await db.none(doneWorkV1.create, req.body);
      return res.status(201).json({
        status: 'Created',
        message: 'Kerjaan berhasil diselesaikan',
      });
    } catch (err) {
      return next(err);
    }
  },
  async getAll(req, res, next) {
    let dateType = null;
    switch (req.query.date_filter_type) {
      case 'created_at':
      default:
        dateType = 'work.created_at';
        break;
      case 'assigned_at':
        dateType = 'assigned_work.assigned_at';
        break;
      case 'done_at':
        dateType = 'worker_work.done_at';
        break;
    }

    let positionExpression = null;
    if (typeof req.query.position === 'undefined') {
      positionExpression = pgp.as.format('');
    } else {
      positionExpression = pgp.as.format('and worker_work.position = $1', [
        req.query.position,
      ]);
    }

    const searchKeyword =
      typeof req.query.search_keyword === 'undefined'
        ? ''
        : req.query.search_keyword;
    const params = {
      worker_id: req.params.id,
      date_filter_type: dateType,
      start_date: req.query.start_date,
      end_date: `${req.query.end_date}T23:59:59.000`,
      search_keyword: `%${searchKeyword}%`,
      position_expression: positionExpression,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
    };
    try {
      const result = await db.one(doneWorkV1.getAll, params);
      return res.status(200).json({
        status: 'OK',
        data: result.data == null ? [] : result.data,
        meta: { total_page: Math.ceil(result.count / req.query.limit) },
        message: 'Semua kerjaan yang sudah selesai berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
  async delete(req, res, next) {
    try {
      await db.none(doneWorkV1.delete, req.params);
      return res.status(200).json({
        status: 'OK',
        message: 'Kerjaan tidak jadi selesai',
      });
    } catch (err) {
      return next(err);
    }
  },
  async getDonables(req, res, next) {
    const searchKeyword =
      typeof req.query.search_keyword === 'undefined'
        ? ''
        : req.query.search_keyword;
    const params = {
      worker_id: req.params.id,
      start_date: req.query.start_date,
      end_date: `${req.query.end_date}T23:59:59.000`,
      search_keyword: `%${searchKeyword}%`,
      position: req.query.position,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
    };
    try {
      const result = await db.one(doneWorkV1.getDonables, params);
      return res.status(200).json({
        status: 'OK',
        data: result.data == null ? [] : result.data,
        meta: { total_page: Math.ceil(result.count / req.query.limit) },
        message: 'Semua kerjaan yang bisa diselesaikan berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default DoneWork;
