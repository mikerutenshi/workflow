/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint('worker_work', 'primary_key_constraint', { ifExists: true });
  // pgm.addConstraint('worker_work', 'primary_key_constraint', {
  // primaryKey: 'worker_work_id'
  // });
  pgm.renameColumn('worker_work', 'worker_work_id', 'id');
  pgm.addConstraint('worker_work', 'worker_work_pkey', {
    primaryKey: 'id'
  });
};

exports.down = (pgm) => {
  pgm.renameColumn('worker_work', 'id', 'worker_work_id');
  pgm.dropConstraint('worker_work', 'primary_key_constraint', { ifExists: true });
  pgm.addConstraint('worker_work', 'primary_key_constraint', {
    primaryKey: ['worker_work_id', 'worker_id', 'work_id', 'position']
  });
};
