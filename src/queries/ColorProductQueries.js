import { colorProduct, labourCost, productColor } from '../sql';
import { db } from '../db';

const ColorProduct = {
  async create(req, res, next) {
    try {
      await db.tx(async (t) => {
        const cP = await t.one(colorProduct.create, req.body);
        req.body.labour_costs.map(async (cost) => {
          try {
            return await t.none(labourCost.create, {
              product_id: cP.product_id,
              name: cost.name,
              cost: cost.cost
            });
          } catch (err) {
            return next(err);
          }
        });
        req.body.color_ids.map(async (color) => {
          try {
            return await t.none(productColor.create, {
              product_id: cP.product_id,
              color_id: color
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
            message: 'Sepatu berwarna berhasil dibuat'
          });
      }
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await db.any(colorProduct.getAll);
      return res.status(200)
        .json({
          status: 'OK',
          data,
          message: 'Sepatu-sepatu berwarna berhasil dibuat'
        });
    } catch (err) {
      return next(err);
    }
  },

  // only update product specific data
  async update(req, res, next) {
    const params = req.body;
    params.product_id = req.params.id;
    try {
      await db.none(colorProduct.update, params);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Data sepatu berhasil dirubah'
        });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await db.none(colorProduct.delete, [req.params.id]);

      return res.status(200)
        .json({
          status: 'OK',
          message: 'Sepatu berhasil dihapus'
        });
    } catch (err) {
      return next(err);
    }
  }
};

export default ColorProduct;
