exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('product', 'article_no', { type: 'varchar(7)' });
};

exports.down = (pgm) => {
  pgm.alterColumn('product', 'article_no', { type: 'varchar(6)' });
};
