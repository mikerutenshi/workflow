exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('product', {
    id: 'id',
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
    assemgblng_cost: {
      type: 'integer',
      notNull: true
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('product', {
    ifExists: true
  });
};
