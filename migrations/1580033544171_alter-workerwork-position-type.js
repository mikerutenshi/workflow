exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropView('worker_costs', { ifExists: true });
  pgm.alterColumn('worker_work', 'position', { type: 'varchar(255)' });
};

exports.down = (pgm) => {
  pgm.dropView('worker_costs', { ifExists: true });
  pgm.alterColumn('worker_work', 'position', { type: 'position_type', using: 'position::position_type' });
};
