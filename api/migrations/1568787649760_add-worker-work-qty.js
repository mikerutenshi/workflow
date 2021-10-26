exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('worker_work', {
    quantity: {
      type: 'integer',
      default: 0,
      notNull: true
    }
  });
  pgm.dropConstraint('worker_work', 'primary_key_constraint', { ifExists: true });
  pgm.addConstraint('worker_work', 'primary_key_constraint', {
    primaryKey: ['worker_id', 'work_id', 'position', 'quantity']
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('worker_work', ['quantity'], { ifExists: true });
};
