exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('app_user', {
    id: 'id',
    username: {
      type: 'varchar(128)',
      notNull: true,
      unique: true
    },
    first_name: {
      type: 'varchar(128)',
      notNull: true,
    },
    last_name: {
      type: 'varchar(128)',
      notNull: false,
    },
    password: {
      type: 'varchar(128)',
      notNull: true,
    },
    role: {
      type: 'varchar(128)',
      notNull: true,
    },
    is_active: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    created_at: 'created_at',
  });
};
