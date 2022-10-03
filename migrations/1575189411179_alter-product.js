exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('product', 'article_no', { type: 'varchar(128)' });
  pgm.addColumns('product', {
    lining_drawing_cost: {
      type: 'integer',
      default: 0
    },
    insole_stitching_cost: {
      type: 'integer',
      notNull: false,
      default: 0
    }
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('product', 'article_no', { type: 'varchar(6)' });
  pgm.dropColumns('product', ['lining_drawing_cost', 'insole_stitching_cost'], { ifExists: true });
};
