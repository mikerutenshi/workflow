exports.shorthands = {
  worker_id: {
    type: 'integer',
    references: '"worker"'
  }
};

exports.up = (pgm) => {
  pgm.createType('position_type', [
    'drawer',
    'sewer',
    'assembler',
    'sole_stitcher'
  ]);

  pgm.createTable('worker', {
    worker_id: 'id',
    name: {
      type: 'varchar(128)',
      notNull: true
    },
    position: {
      type: 'position_type[]',
      notNull: true
    },
    created_at: 'created_at'
  });

  pgm.createTable('work', {
    work_id: 'id',
    spk_no: 'integer',
    product_id: {
      type: 'integer',
      notNull: true,
      references: '"product"',
      onDelete: 'cascade'
    },
    is_drawn: {
      type: 'boolean',
      default: false
    },
    is_sewn: {
      type: 'boolean',
      default: false
    },
    is_assembled: {
      type: 'boolean',
      default: false
    },
    is_sole_stitched: {
      type: 'boolean',
      default: false
    },
    product_quantity: 'integer',
    created_at: 'created_at'
  });

  pgm.createTable('worker_work', {
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
    created_at: 'created_at'
  });
  pgm.addConstraint('worker_work', 'primary_key_constraint', { primaryKey: ['worker_id', 'work_id', 'position'] });
};

exports.down = (pgm) => {
  pgm.dropTable('worker_work', { ifExists: true, cascade: true });
  pgm.dropTable('work', { ifExists: true, cascade: true });
  pgm.dropTable('worker', { ifExists: true, cascade: true });
  pgm.dropType('position_type');
};
