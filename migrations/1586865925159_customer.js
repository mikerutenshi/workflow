/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('customer', {
    id: 'id',
    name: {
      type: 'varchar(64)',
      notNull: true
    },
    address: {
      type: 'text',
      notNull: true
    },
    city: {
      type: 'varchar(64)',
      notNull: true
    },
    created_at: 'created_at'
  });
};
