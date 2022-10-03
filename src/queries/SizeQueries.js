import { size } from '../sql';
import { db } from '../db';

const Color = {
  async create(req, res, next) {
    try {
      await db.none(size.create, req.body);
      return res.status(201)
        .json({
          status: 'Created',
          message: 'Ukuran berhasil dibuat'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(size.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Semua ukuran berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const param = { id: req.params.id, name: req.body.name };
    try {
      await db.none(size.update, param);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Ukuran berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(size.delete, req.query);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Ukuran-ukuran berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default Color;
