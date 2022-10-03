exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('work', { notes: 'text' });
  pgm.addColumns('worker_work', { notes: 'text' });
  pgm.addColumns('assigned_work', { notes: 'text' });
};
