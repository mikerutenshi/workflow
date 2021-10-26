/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('labour_cost_type', [
    'drawing',
    'lining_drawing',
    'sewing',
    'assembling',
    'outsole_stitching',
    'insole_stitching'
  ]);

  pgm.dropType('position_type', { ifExists: true });
  pgm.createType('position_type', [
    'drawer',
    'lining_drawer',
    'sewer',
    'assembler',
    'outsole_stitcher',
    'insole_stitcher'
  ]);

  pgm.createTable('labour_cost', {
    id: 'id',
    product_id: {
      type: 'integer',
      notNull: true,
      references: '"product"',
      onDelete: 'cascade'
    },
    name: { type: 'labour_cost_type', notNull: true },
    cost: { type: 'integer', notNull: true }
  });

  pgm.createTable('product_category', {
    id: 'id',
    name: { type: 'varchar(64)', notNull: true }
  });

  pgm.createTable('color', {
    id: 'id',
    name: { type: 'varchar(64)', notNull: true }
  });

  pgm.createTable('assigned_work', {
    id: 'id',
    worker_id: {
      type: 'integer',
      notNull: true,
      references: '"worker"',
      onDelete: 'cascade'
    },
    work_id: {
      type: 'integer',
      notNull: true,
      references: '"work"',
      onDelete: 'cascade'
    },
    position: {
      type: 'position_type',
      notNull: true
    },
    quantity: { type: 'integer' },
    created_at: 'created_at'
  });
};

exports.down = (pgm) => {
  pgm.dropType('position_type', { ifExists: true });
  pgm.dropType('labour_cost_type', { ifExists: true });
  pgm.dropTable('labour_cost', { ifExists: true });
  pgm.dropTable('product_category', { ifExists: true, cascade: true });
  pgm.dropTable('color', { ifExists: true, cascade: true });
  pgm.dropTable('assigned_work', { ifExists: true });
};
