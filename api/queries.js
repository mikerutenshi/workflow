import promise from 'bluebird';
import config from 'config';

const options = {
  promiseLib: promise
};

const dbConfig = config.get('db');
const pgp = require('pg-promise')(options);
const db = pgp({
  dbConfig
});

const Product = {
  create(req, res, next) {
    db.none('INSERT INTO product(article_no, drawing_cost, sewing_cost, assembling_cost) VALUES(${article_no}, ${drawing_cost}, ${sewing_cost}, ${assembling_cost})', req.body) 
      .then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one product'
          });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getAll(req, res, next) {
    db.any('SELECT * FROM product')
      .then((data) => {
        res.status(200)
          .json({
            status: 'success',
            data,
            message: 'Retreived all products'
          });
      })
      .catch((err) => {
        return next(err);
      });
  }
};

export default Product;
