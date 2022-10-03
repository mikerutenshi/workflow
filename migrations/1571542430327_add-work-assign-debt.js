exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('worker_work', {
    worker_work_id: {
      type: 'serial',
      notNull: true
    }
  });
  pgm.dropConstraint('worker_work', 'primary_key_constraint', { ifExists: true });
  pgm.addConstraint('worker_work', 'primary_key_constraint', {
    primaryKey: ['worker_work_id', 'worker_id', 'work_id', 'position']
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('worker_work', ['worker_work_id'], { ifExists: true });
};
