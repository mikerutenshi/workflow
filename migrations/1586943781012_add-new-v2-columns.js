/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('product', {
    product_category_id: {
      type: 'integer',
      references: '"product_category"',
      onDelete: 'cascade'
    }
  });

  pgm.addColumns('work', {
    quantity: 'integer'
  });
};
