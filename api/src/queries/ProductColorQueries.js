import { productColor } from '../sql';
import { db } from '../db';

const ProductColor = {
  async create(req, res, next) {
    try {
      await db.none(productColor.create, req.body);

      return res.status(201)
        .json({
          status: 'Created',
          message: 'Warna sepatu berhasil ditambahkan'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(productColor.delete, req.query);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Warna sepatu berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default ProductColor;
