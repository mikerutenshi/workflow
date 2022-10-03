/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('product', 'drawing_cost', { notNull: false });
  pgm.alterColumn('product', 'sewing_cost', { notNull: false });
  pgm.alterColumn('product', 'assembling_cost', { notNull: false });
};

exports.down = (pgm) => {
  pgm.alterColumn('product', 'drawing_cost', { notNull: true });
  pgm.alterColumn('product', 'sewing_cost', { notNull: true });
  pgm.alterColumn('product', 'assembling_cost', { notNull: true });
};
