import { work, workPurchaseOrderProduct } from '../sql';
import { db } from '../db';

const WorkV2 = {
  async create(req, res, next) {
    try {
      await db.tx(async (t) => {
        const createdWork = await t.one(work.create, req.body);
        req.body.products.map(async (product) => {
          try {
            return await t.none(workPurchaseOrderProduct.create, {
              work_id: createdWork.work_id,
              purchase_order_id: product.purchase_order_id,
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
            message: 'Kerjaan berhasil dibuat'
          });
      }
    } catch (err) {
      return next(err);
    }
  },

  async getPerProduct(req, res, next) {
    try {
      const data = await db.any(work.getPerProduct, req.query);

      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Kerjaan per sepatu berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default WorkV2;
