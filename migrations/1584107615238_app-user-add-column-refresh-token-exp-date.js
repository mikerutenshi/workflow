/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('app_user', {
    refresh_token_exp_date: { type: 'timestamp', notNull: false },
  });
};
