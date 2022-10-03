import { purchaseOrderProduct } from '../sql';
import { db } from '../db';

const PurchaseOrderProduct = {
  async create(req, res, next) {
    try {
      await db.none(purchaseOrderProduct.create, req.body);

      return res.status(201)
        .json({
          status: 'Created',
          message: 'Sepatu berhasil ditambahkan ke PO'
        });
    } catch (err) {
      return next(err);
    }
  },

  // async getAll(req, res, next) {
  //   try {
  //     const data = await db.any(purchaseOrderProduct.getAll);
  //     return res.status(200)
  //       .json({
  //         status: 'OK',
  //         data,
  //         message: 'Semua sepatu dari PO berhasil diload'
  //       });
  //   } catch (err) {
  //     return next(err);
  //   }
  // },

  // async updateColorProduct(req, res, next) {
  //   const params = req.body;
  //   params.purchase_order_id = req.query.purchase_order_id;
  //   params.product_id = req.query.product_id;
  //   params.body_color_id = req.body.color_id;
  //   params.query_color_id = req.query.color_id;

  //   try {
  //     await db.none(purchaseOrderProduct.updateColorProduct, params);
  //     return res.status(200)
  //       .json({
  //         status: 'OK',
  //         message: 'Sepatu dan warna berhasil dirubah'
  //       });
  //   } catch (err) {
  //     return next(err);
  //   }
  // },

  async updateQuantity(req, res, next) {
    const params = req.query;
    params.quantity = req.body.quantity;

    try {
      await db.none(purchaseOrderProduct.updateQuantity, params);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Kuantitas berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async deleteColorProduct(req, res, next) {
    try {
      await db.none(purchaseOrderProduct.deleteColorProduct, req.query);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Sepatu berhasil dihapus dari PO'
        });
    } catch (err) {
      return next(err);
    }
  },

  async deleteSize(req, res, next) {
    try {
      await db.none(purchaseOrderProduct.deleteSize, req.query);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Ukuran berhasil dihapus dari sepatu'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default PurchaseOrderProduct;
