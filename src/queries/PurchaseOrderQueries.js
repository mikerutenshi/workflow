import { purchaseOrder, purchaseOrderProduct } from '../sql';
import { db } from '../db';

const PurchaseOrder = {
  async create(req, res, next) {
    try {
      await db.tx(async (t) => {
        const order = await t.one(purchaseOrder.create, req.body);
        req.body.products.map(async (product) => {
          try {
            return await t.none(purchaseOrderProduct.create, {
              purchase_order_id: order.id,
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
            message: 'PO berhasil dibuat'
          });
      }
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(purchaseOrder.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Semua PO berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      console.log(req.params);
      const data = await db.one(purchaseOrder.getOne, req.params);

      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Satu PO berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const params = req.body;
    params.id = req.params.id;

    try {
      await db.none(purchaseOrder.update, params);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'PO berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(purchaseOrder.delete, req.params);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'PO berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  },
};

export default PurchaseOrder;
