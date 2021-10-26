/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('assigned_work', {
    assigned_at: 'created_at'
  });
  pgm.addColumns('worker_work', {
    done_at: 'created_at'
  });
};
