exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('product', {
    color: {
      type: 'text',
      notNull: true
    }
  });
};
