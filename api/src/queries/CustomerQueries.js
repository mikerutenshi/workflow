import { customer } from '../sql';
import { db } from '../db';

const Customer = {
  async create(req, res, next) {
    try {
      await db.none(customer.create, req.body);
      return res.status(201)
        .json({
          status: 'Created',
          message: 'Pelanggan berhasil dibuat'
        });
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(customer.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Semua pelanggan berhasil diload'
        });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    const params = req.body;
    params.id = req.params.id;
    try {
      await db.none(customer.update, params);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Pelanggan berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(customer.delete, req.params.id);
      return res.status(200)
        .json({
          status: 'OK',
          message: 'Pelanggan berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default Customer;
