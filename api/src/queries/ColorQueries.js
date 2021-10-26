import { color } from '../sql';
import { db } from '../db';

const Color = {
  async create(req, res, next) {
    try {
      await db.none(color.create, req.body);
      return res.status(201)
        .json({
          status: 'Created',
          message: 'Warna berhasil dibuat'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(color.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Semua warna berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const param = { id: req.params.id, name: req.body.name };
    try {
      await db.none(color.update, param);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Warna berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(color.delete, req.query);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Warna-warna berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default Color;
