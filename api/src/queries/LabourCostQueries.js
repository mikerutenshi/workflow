import { labourCost } from '../sql';
import { db } from '../db';

const LabourCost = {
  async create(req, res, next) {
    try {
      await db.none(labourCost.create, req.body);

      return res.status(201)
        .json({
          status: 'Created',
          message: 'Ongkos tukang berhasil ditambahkan'
        });
    } catch (err) {
      return next(err);
    }
  },

  // only update product specific data
  async update(req, res, next) {
    const params = {
      id: req.params.id,
      cost: req.body.cost
    };
    try {
      await db.none(labourCost.update, params);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Data ongkos tukang berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(labourCost.delete, [req.params.id]);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Ongkos tukang berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default LabourCost;
