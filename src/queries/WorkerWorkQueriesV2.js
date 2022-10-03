import { workerWork, workerWorkProduct } from '../sql';
import { db } from '../db';

const WorkerWork = {
  async create(req, res, next) {
    try {
      await db.tx(async (t) => {
        const worked = await t.one(workerWork.create, req.body);
        req.body.products.map(async (product) => {
          try {
            return await t.none(workerWorkProduct.create, {
              worker_work_id: worked.id,
              product_id: product.product_id,
              color_id: product.color_id,
              size_id: product.size_id,
              quantity: product.quantity
            });
          } catch (err) {
            return next(err);
          }
        });
      });

      if (!res.headersSent) {
        return res.status(201)
          .json({
            status: 'Created',
            message: 'Kerjaan berhasil diselesaikan'
          });
      }
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(workerWork.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Semua kerjaan yang selesai berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(workerWork.delete, req.params);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Kerjaan selesai dibatalkan'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default WorkerWork;
