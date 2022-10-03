/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameTypeValue('position_type', 'outsole_stitcher', 'sole_stitcher');
  pgm.dropView('worker_costs', { ifExists: true });
  pgm.alterColumn('worker_work', 'position', { type: 'position_type', using: 'position::position_type' });
};

exports.down = (pgm) => {
  pgm.renameTypeValue('position_type', 'sole_stitcher', 'outsole_stitcher');
  pgm.dropView('worker_costs', { ifExists: true });
  pgm.alterColumn('worker_work', 'position', { type: 'varchar(255)' });
};
