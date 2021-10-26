exports.shorthands = {
  updated_at: {
    type: 'timestamp',
    notNull: false
  }
};

exports.up = (pgm) => {
  pgm.addColumns('worker', {
    updated_at: 'updated_at'
  });
  pgm.addColumns('work', {
    updated_at: 'updated_at'
  });
  pgm.addColumns('product', {
    updated_at: 'updated_at'
  });
};
