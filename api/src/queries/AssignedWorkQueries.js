import { assignedWork, assignedWorkProduct } from '../sql';
import { db } from '../db';

const AssignedWork = {
  async create(req, res, next) {
    try {
      await db.tx(async (t) => {
        const assigned = await t.one(assignedWork.create, req.body);
        req.body.products.map(async (product) => {
          try {
            return await t.none(assignedWorkProduct.create, {
              assigned_work_id: assigned.id,
              product_id: product.product_id,
              color_id: product.color_id,
              size_id: product.size_id,
              quantity: product.quantity,
            });
          } catch (err) {
            return next(err);
          }
        });
      });

      if (!res.headersSent) {
        return res.status(201).json({
          status: 'Created',
          message: 'Kerjaan berhasil diberikan',
        });
      }
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(assignedWork.getAll);
      return res.status(200).json({
        status: 'OK',
        data,
        message: 'Semua kerjaan yang diberikan berhasil diload',
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default AssignedWork;
