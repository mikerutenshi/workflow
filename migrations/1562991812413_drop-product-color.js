exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumns('product', 'color', { ifExists: true });
};

exports.down = (pgm) => {
  pgm.addColumns('product', {
    color: {
      type: 'text',
    }
  });
};
