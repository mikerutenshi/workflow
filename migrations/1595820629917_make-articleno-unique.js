/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('product', 'unique_article_no_constraint', {
    unique: 'article_no',
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('product', 'unique_article_no_constraint', {
    ifExists: true,
  });
};
