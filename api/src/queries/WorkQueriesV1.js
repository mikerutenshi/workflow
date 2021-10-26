import { db } from '../db';
import { workV1 } from '../sql';

const Work = {
  async getAll(req, res, next) {
    const searchKeyword = typeof req.query.search_keyword === 'undefined' ? '' : req.query.search_keyword;
    const params = {
      start_date: req.query.start_date,
      end_date: `${req.query.end_date}T23:59:59.000`,
      search_keyword: `%${searchKeyword}%`,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit
    };
    try {
      const result = await db.one(workV1.getAll, params);
      return res.status(200)
        .json({
          status: 'OK',
          data: result.data,
          meta: {
            total_page: result.total_page
          },
          message: 'Semua Kerjaan berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getOneWorkerWork(req, res, next) {
    const params = {
      id: req.params.id,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit
    };
    try {
      const result = await db.one(workV1.getOneWorkerWork, params);
      return res.status(200)
        .json({
          status: 'OK',
          data: result.data,
          meta: {
            total_page: result.total_page
          },
          message: 'Semua detail kerjaan selesai berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getOneAssignedWork(req, res, next) {
    const params = {
      id: req.params.id,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit
    };
    try {
      const result = await db.one(workV1.getOneAssignedWork, params);
      return res.status(200)
        .json({
          status: 'OK',
          data: result.data,
          meta: {
            total_page: result.total_page
          },
          message: 'Semua detail sedang dikerjakan berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default Work;
