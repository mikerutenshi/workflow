exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('worker',
    'position',
    { type: 'varchar(255)[]' });
};
