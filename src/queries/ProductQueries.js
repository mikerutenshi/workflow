import csv from 'csvtojson';
import path from 'path';
import mkdirp from 'mkdirp';
import util from 'util';
import fs from 'fs';
import { pgp, db } from '../db';
import { product } from '../sql';
import { Parser } from 'json2csv';

const Product = {
  create(req, res, next) {
    db.none(product.create, req.body)
      .then(() => {
        res.status(201).json({
          status: 'Created',
          message: 'Sepatu berhasil dibuat',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  getAll(req, res, next) {
    const articleNo =
      typeof req.query.article_no === 'undefined' ? '' : req.query.article_no;
    const filter = `%${articleNo}%`;
    const page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    const limit =
      typeof req.query.limit === 'undefined' ? null : req.query.limit;

    db.task((t) => {
      return t.batch([
        t.any(
          `SELECT *, name as product_category_name FROM product JOIN product_category ON product.product_category_id = product_category.id WHERE article_no LIKE $3 ORDER BY article_no LIMIT $1 OFFSET $2`,
          [limit, (page - 1) * limit, filter],
        ),
        t.one(
          'SELECT COUNT(*) FROM product JOIN product_category ON product.product_category_id = product_category.id WHERE article_no LIKE $1',
          filter,
        ),
      ]);
    })
      .then((d) => {
        const totalRow = d[1].count;
        let totalPage = 1;
        if (limit !== null) {
          totalPage = Math.ceil(totalRow / limit);
        }
        res.status(200).json({
          status: 'OK',
          data: d[0],
          meta: {
            total_page: totalPage,
            total_row: parseInt(totalRow, 10),
          },
          message: 'Semua sepatu berhasil diload',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  delete(req, res, next) {
    const productId = req.query.product_id;
    db.none('DELETE FROM product WHERE product_id in ($1:csv)', [productId])
      .then(() => {
        res.status(200).json({
          status: 'OK',
          message: 'Sepatu berhasil dihapus',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  importCSV() {
    const filePath = path.resolve(__dirname, '../../temp/product_import.csv');
    csv()
      .fromFile(filePath)
      .then((data) => {
        const query = pgp.helpers.insert(
          data,
          [
            'article_no',
            'drawing_cost',
            'sewing_cost',
            'assembling_cost',
            'sole_stitching_cost',
          ],
          'product',
        );
        db.none(query)
          .then(() => {
            console.log('Products imported');
          })
          .catch((err) => {
            console.log('ERROR:', err);
          });
      });
    // const values = {
    //   delimiter: ',',
    //   path: path.resolve(__dirname, '../../seed_product.csv')
    // };
    // db.none('\copy product(article_no, drawing_cost, sewing_cost, assembling_cost) FROM ${path} WITH CSV DELIMITER ${delimiter}', values)
    //   .then(() => {
    //     console.log('product seeded');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  },
  importCsv(req, res, next) {
    if (req.file) {
      console.log(util.inspect(req.file));
      if (req.file.size === 0) {
        return next(new Error('Ukuran file 0'));
      }
      fs.exists(req.file.path, (exists) => {
        if (exists) {
          csv()
            .fromFile(req.file.path)
            .then((data) => {
              const query = pgp.helpers.insert(
                data,
                [
                  'article_no',
                  'drawing_cost',
                  'sewing_cost',
                  'assembling_cost',
                  'sole_stitching_cost',
                  'lining_drawing_cost',
                  'insole_stitching_cost',
                  'product_category_id',
                ],
                'product',
              );
              db.none(query)
                .then(() => {
                  res.status(200).json({
                    status: 'OK',
                    message: `Berhasil disave di: ${req.file.path}`,
                  });
                  console.log('Products imported');
                })
                .catch((err) => {
                  return next(err);
                });
            });
        } else {
          res.status(204).json({
            status: 'No Content',
            message: 'File tidak ada isinya',
          });
        }
      });
    } else {
      return next(new Error('Tolong pilih file terlebih dahulu'));
    }
  },
  exportCsv(req, res, next) {
    const tempPath = path.resolve(__dirname, '../../temp');
    const exportPath = path.resolve(__dirname, '../../temp/product_export.csv');
    // const writeStream = fs.createWriteStream(exportPath);
    const jsonCsvParser = new Parser({ header: true });

    const makeCsvFile = () => {
      db.any('SELECT * FROM product')
        .then((data) => {
          const mCsv = jsonCsvParser.parse(data);
          fs.writeFile(exportPath, mCsv, (error) => {
            if (error) throw error;
            else console.log('write sucessful');
            res.download(exportPath, (err) => {
              if (err) throw error;
              else console.log('download successful');
            });
          });
        })
        .catch((err) => {
          return next(err);
        });

      // Fast Csv Method
      //
      // const values = {
      //   delimiter: ',',
      //   path: exportPath
      // };
      // db.any('SELECT * FROM product')
      //   .then((data) => {
      //     fastCsv
      //       .write(data, { headers: true })
      //       .on('finish', () => {
      //         console.log('Successfully saved as:', values.path);
      //         res.download(exportPath, err => console.log(err));
      //       })
      //       .pipe(writeStream);
      //   })
      //   .catch((err) => {
      //     return next(err);
      //   });

      // db.none('\copy (SELECT * FROM product) TO ${path} WITH CSV DELIMITER ${delimiter} HEADER'
      //  , values)
      //   .then(() => {
      //     res.download(exportPath, err => console.log(err));
      //   })
      //   .catch((err) => {
      //     return next(err);
      //   });
    };

    mkdirp(tempPath)
      .then((made) => {
        console.log(`made directories, starting with ${made}`);
        makeCsvFile();
      })
      .catch((err) => console.error(err));
  },
  deleteAll() {
    db.none('TRUNCATE TABLE product RESTART IDENTITY CASCADE')
      .then(() => {
        console.log('All products deleted');
      })
      .catch((err) => {
        console.log('ERROR:', err);
      });
  },
  update(req, res, next) {
    db.none(
      'UPDATE product SET article_no = $1, product_category_id = $9, drawing_cost = $2, lining_drawing_cost = $7, sewing_cost = $3, assembling_cost = $4, insole_stitching_cost = $8, sole_stitching_cost = $5, updated_at = now() WHERE product_id = $6',
      [
        req.body.article_no,
        req.body.drawing_cost,
        req.body.sewing_cost,
        req.body.assembling_cost,
        req.body.sole_stitching_cost,
        req.params.product_id,
        req.body.lining_drawing_cost,
        req.body.insole_stitching_cost,
        req.body.product_category_id,
      ],
    )
      .then(() => {
        res.status(200).json({
          status: 'OK',
          message: 'Sepatu berhasil diubah',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },

  importCsvUpdate(req, res, next) {
    if (req.file) {
      console.log(util.inspect(req.file));
      if (req.file.size === 0) {
        return next(new Error('Ukuran file 0'));
      }
      fs.exists(req.file.path, (exists) => {
        if (exists) {
          csv()
            .fromFile(req.file.path)
            .then((data) => {
              const cs = new pgp.helpers.ColumnSet([
                {
                  name: 'product_id',
                  cnd: true,
                  cast: 'int',
                },
                {
                  name: 'article_no',
                  cast: 'varchar',
                },
                {
                  name: 'drawing_cost',
                  cast: 'int',
                },
                {
                  name: 'sewing_cost',
                  cast: 'int',
                },
                {
                  name: 'assembling_cost',
                  cast: 'int',
                },
                {
                  name: 'sole_stitching_cost',
                  cast: 'int',
                },
                {
                  name: 'lining_drawing_cost',
                  cast: 'int',
                },
                {
                  name: 'insole_stitching_cost',
                  cast: 'int',
                },
                {
                  name: 'product_category_id',
                  cast: 'int',
                },
                {
                  name: 'updated_at',
                  mod: ':raw',
                  init: () => 'now()',
                },
              ]);
              const query = `${pgp.helpers.update(
                data,
                cs,
                'product',
              )} WHERE v.product_id = t.product_id`;
              db.none(query)
                .then(() => {
                  res.status(200).json({
                    status: 'OK',
                    message: `Berhasil disave di: ${req.file.path}`,
                  });
                  console.log('Products imported');
                })
                .catch((err) => {
                  return next(err);
                });
            });
        } else {
          res.status(204).json({
            status: 'No Content',
            message: 'File tidak ada isinya',
          });
        }
      });
    } else {
      return next(new Error('Tolong pilih file terlebih dahulu'));
    }
  },
};

export default Product;
// export const productSeeder = Product.importCSV();
// export const deleteAll = Product.deleteAll();
// module.exports.productSeeder = Product.importCSV();
// require('make-runnable');
