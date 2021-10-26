/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('worker_work', {
    assigned_work_id: {
      type: 'integer',
      references: '"assigned_work"',
      onDelete: 'cascade'
    }
  });
};
