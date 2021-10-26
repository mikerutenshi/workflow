import { productCategory } from '../sql';
import { db } from '../db';

const ProductCategory = {
  async create(req, res, next) {
    try {
      await db.none(productCategory.create, req.body);
      return res.status(201)
        .json({
          status: 'Created',
          message: 'Kategori sepatu berhasil dibuat'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(productCategory.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Semua kategori sepatu berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const param = { id: req.params.id, name: req.body.name };
    try {
      await db.none(productCategory.update, param);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Kategori sepatu berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(productCategory.delete, req.query);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Kategori-kategori sepatu berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default ProductCategory;
