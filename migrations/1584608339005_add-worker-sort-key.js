/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('worker', {
    sort_key_position: { type: 'varchar(32)', default: '00' },
  });
};
