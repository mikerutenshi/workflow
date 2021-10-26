/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('work', 'product_id', { notNull: false });
};

exports.down = (pgm) => {
  pgm.alterColumn('work', 'product_id', { notNull: true });
};
