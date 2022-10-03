import { assignedWorkV1 } from '../sql';
import { db, pgp } from '../db';
import Position from '../helpers/position';

const AssignedWork = {
  async create(req, res, next) {
    try {
      if (typeof req.body.notes === 'undefined') {
        req.body.notes = null;
      }

      await db.none(assignedWorkV1.create, req.body);
      return res.status(201).json({
        status: 'Created',
        message: 'Kerjaan berhasil diberikan',
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
    }

    const searchKeyword =
      typeof req.query.search_keyword === 'undefined'
        ? ''
        : req.query.search_keyword;
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
      const result = await db.one(assignedWorkV1.getAll, params);
      return res.status(200).json({
        status: 'OK',
        data: result.data == null ? [] : result.data,
        meta: { total_page: Math.ceil(result.count / req.query.limit) },
        message: 'Semua kerjaan yang dikerjakan berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
  async delete(req, res, next) {
    try {
      await db.none(assignedWorkV1.delete, req.params);
      return res.status(200).json({
        status: 'OK',
        message: 'Pengerjaan berhasil dibatalkan',
      });
    } catch (err) {
      return next(err);
    }
  },
  async getAssignables(req, res, next) {
    const searchKeyword =
      typeof req.query.search_keyword === 'undefined'
        ? ''
        : req.query.search_keyword;
    let priceColumn = '';
    switch (req.query.position) {
      case Position.DRAWER:
        priceColumn = 'product.drawing_cost';
        break;
      case Position.SEWER:
        priceColumn = 'product.sewing_cost';
        break;
      case Position.ASSEMBLER:
        priceColumn = 'product.assembling_cost';
        break;
      case Position.SOLE_STITCHER:
      default:
        priceColumn = 'product.sole_stitching_cost';
        break;
      case Position.LINING_DRAWER:
        priceColumn = 'product.lining_drawing_cost';
        break;
      case Position.INSOLE_STITCHER:
        priceColumn = 'product.insole_stitching_cost';
        break;
    }
    const params = {
      start_date: req.query.start_date,
      end_date: `${req.query.end_date}T23:59:59.000`,
      search_keyword: `%${searchKeyword}%`,
      position: req.query.position,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
      price_column: priceColumn,
    };
    try {
      const result = await db.one(assignedWorkV1.getAssignables, params);
      return res.status(200).json({
        status: 'OK',
        data: result.data == null ? [] : result.data,
        meta: { total_page: Math.ceil(result.count / req.query.limit) },
        message: 'Semua kerjaan yang bisa diberikan berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default AssignedWork;
