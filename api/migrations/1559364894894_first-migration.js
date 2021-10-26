const { PgLiteral } = require('node-pg-migrate');

exports.shorthands = {
  // id: {
  //  type: 'uuid',
  //  primaryKey: true,
  //  notNull: true
  // },
  created_at: {
    type: 'timestamp',
    notNull: true,
    default: PgLiteral.create('CURRENT_TIMESTAMP')
  }
};

exports.up = (pgm) => {
  pgm.createTable('product', {
    product_id: 'id',
    article_no: {
      type: 'varchar(6)',
      notNull: true,
    },
    drawing_cost: {
      type: 'integer',
      notNull: true,
    },
    sewing_cost: {
      type: 'integer',
      notNull: true
    },
    assembling_cost: {
      type: 'integer',
      notNull: true
    },
    sole_stitching_cost: {
      type: 'integer',
      notNull: false
    },
    created_at: 'created_at'
  });
};
