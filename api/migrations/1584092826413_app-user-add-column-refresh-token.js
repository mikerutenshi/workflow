/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('app_user', {
    refresh_token: { type: 'varchar(128)', notNull: false },
  });
};
