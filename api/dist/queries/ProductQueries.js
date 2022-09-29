"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _path = _interopRequireDefault(require("path"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _db = require("../db");

var _sql = require("../sql");

var _json2csv = require("json2csv");

var Product = {
  create: function create(req, res, next) {
    _db.db.none(_sql.product.create, req.body).then(function () {
      res.status(201).json({
        status: 'Created',
        message: 'Sepatu berhasil dibuat'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  getAll: function getAll(req, res, next) {
    var articleNo = typeof req.query.article_no === 'undefined' ? '' : req.query.article_no;
    var filter = "%".concat(articleNo, "%");
    var page = typeof req.query.page === 'undefined' ? 1 : req.query.page;
    var limit = typeof req.query.limit === 'undefined' ? null : req.query.limit;

    _db.db.task(function (t) {
      return t.batch([t.any("SELECT *, name as product_category_name FROM product JOIN product_category ON product.product_category_id = product_category.id WHERE article_no LIKE $3 ORDER BY article_no LIMIT $1 OFFSET $2", [limit, (page - 1) * limit, filter]), t.one('SELECT COUNT(*) FROM product JOIN product_category ON product.product_category_id = product_category.id WHERE article_no LIKE $1', filter)]);
    }).then(function (d) {
      var totalRow = d[1].count;
      var totalPage = 1;

      if (limit !== null) {
        totalPage = Math.ceil(totalRow / limit);
      }

      res.status(200).json({
        status: 'OK',
        data: d[0],
        meta: {
          total_page: totalPage,
          total_row: parseInt(totalRow, 10)
        },
        message: 'Semua sepatu berhasil diload'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  "delete": function _delete(req, res, next) {
    var productId = req.query.product_id;

    _db.db.none('DELETE FROM product WHERE product_id in ($1:csv)', [productId]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Sepatu berhasil dihapus'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  importCSV: function importCSV() {
    var filePath = _path["default"].resolve(__dirname, '../../temp/product_import.csv');

    (0, _csvtojson["default"])().fromFile(filePath).then(function (data) {
      var query = _db.pgp.helpers.insert(data, ['article_no', 'drawing_cost', 'sewing_cost', 'assembling_cost', 'sole_stitching_cost'], 'product');

      _db.db.none(query).then(function () {
        console.log('Products imported');
      })["catch"](function (err) {
        console.log('ERROR:', err);
      });
    }); // const values = {
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
  importCsv: function importCsv(req, res, next) {
    if (req.file) {
      console.log(_util["default"].inspect(req.file));

      if (req.file.size === 0) {
        return next(new Error('Ukuran file 0'));
      }

      _fs["default"].exists(req.file.path, function (exists) {
        if (exists) {
          (0, _csvtojson["default"])().fromFile(req.file.path).then(function (data) {
            var query = _db.pgp.helpers.insert(data, ['article_no', 'drawing_cost', 'sewing_cost', 'assembling_cost', 'sole_stitching_cost', 'lining_drawing_cost', 'insole_stitching_cost', 'product_category_id'], 'product');

            _db.db.none(query).then(function () {
              res.status(200).json({
                status: 'OK',
                message: "Berhasil disave di: ".concat(req.file.path)
              });
              console.log('Products imported');
            })["catch"](function (err) {
              return next(err);
            });
          });
        } else {
          res.status(204).json({
            status: 'No Content',
            message: 'File tidak ada isinya'
          });
        }
      });
    } else {
      return next(new Error('Tolong pilih file terlebih dahulu'));
    }
  },
  exportCsv: function exportCsv(req, res, next) {
    var tempPath = _path["default"].resolve(__dirname, '../../temp');

    var exportPath = _path["default"].resolve(__dirname, '../../temp/product_export.csv'); // const writeStream = fs.createWriteStream(exportPath);


    var jsonCsvParser = new _json2csv.Parser({
      header: true
    });

    var makeCsvFile = function makeCsvFile() {
      _db.db.any('SELECT * FROM product').then(function (data) {
        var mCsv = jsonCsvParser.parse(data);

        _fs["default"].writeFile(exportPath, mCsv, function (error) {
          if (error) throw error;else console.log('write sucessful');
          res.download(exportPath, function (err) {
            if (err) throw error;else console.log('download successful');
          });
        });
      })["catch"](function (err) {
        return next(err);
      }); // Fast Csv Method
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

    (0, _mkdirp["default"])(tempPath).then(function (made) {
      console.log("made directories, starting with ".concat(made));
      makeCsvFile();
    })["catch"](function (err) {
      return console.error(err);
    });
  },
  deleteAll: function deleteAll() {
    _db.db.none('TRUNCATE TABLE product RESTART IDENTITY CASCADE').then(function () {
      console.log('All products deleted');
    })["catch"](function (err) {
      console.log('ERROR:', err);
    });
  },
  update: function update(req, res, next) {
    _db.db.none('UPDATE product SET article_no = $1, product_category_id = $9, drawing_cost = $2, lining_drawing_cost = $7, sewing_cost = $3, assembling_cost = $4, insole_stitching_cost = $8, sole_stitching_cost = $5, updated_at = now() WHERE product_id = $6', [req.body.article_no, req.body.drawing_cost, req.body.sewing_cost, req.body.assembling_cost, req.body.sole_stitching_cost, req.params.product_id, req.body.lining_drawing_cost, req.body.insole_stitching_cost, req.body.product_category_id]).then(function () {
      res.status(200).json({
        status: 'OK',
        message: 'Sepatu berhasil diubah'
      });
    })["catch"](function (err) {
      return next(err);
    });
  },
  importCsvUpdate: function importCsvUpdate(req, res, next) {
    if (req.file) {
      console.log(_util["default"].inspect(req.file));

      if (req.file.size === 0) {
        return next(new Error('Ukuran file 0'));
      }

      _fs["default"].exists(req.file.path, function (exists) {
        if (exists) {
          (0, _csvtojson["default"])().fromFile(req.file.path).then(function (data) {
            var cs = new _db.pgp.helpers.ColumnSet([{
              name: 'product_id',
              cnd: true,
              cast: 'int'
            }, {
              name: 'article_no',
              cast: 'varchar'
            }, {
              name: 'drawing_cost',
              cast: 'int'
            }, {
              name: 'sewing_cost',
              cast: 'int'
            }, {
              name: 'assembling_cost',
              cast: 'int'
            }, {
              name: 'sole_stitching_cost',
              cast: 'int'
            }, {
              name: 'lining_drawing_cost',
              cast: 'int'
            }, {
              name: 'insole_stitching_cost',
              cast: 'int'
            }, {
              name: 'product_category_id',
              cast: 'int'
            }, {
              name: 'updated_at',
              mod: ':raw',
              init: function init() {
                return 'now()';
              }
            }]);
            var query = "".concat(_db.pgp.helpers.update(data, cs, 'product'), " WHERE v.product_id = t.product_id");

            _db.db.none(query).then(function () {
              res.status(200).json({
                status: 'OK',
                message: "Berhasil disave di: ".concat(req.file.path)
              });
              console.log('Products imported');
            })["catch"](function (err) {
              return next(err);
            });
          });
        } else {
          res.status(204).json({
            status: 'No Content',
            message: 'File tidak ada isinya'
          });
        }
      });
    } else {
      return next(new Error('Tolong pilih file terlebih dahulu'));
    }
  }
};
var _default = Product; // export const productSeeder = Product.importCSV();
// export const deleteAll = Product.deleteAll();
// module.exports.productSeeder = Product.importCSV();
// require('make-runnable');

exports["default"] = _default;