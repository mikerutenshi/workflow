/* eslint-disable camelcase */

exports.shorthands = {
  integerNotNull: {
    type: 'integer',
    notNull: true,
  }
};

exports.up = (pgm) => {
  pgm.createTable('purchase_order', {
    id: 'id',
    customer_id: {
      type: 'integer',
      notNull: true,
      references: '"customer"',
      onDelete: 'cascade'
    },
    date: {
      type: 'date',
      notNull: true
    },
    created_at: 'created_at'
  });

  pgm.createTable('color_product', {
    product_id: {
      type: 'integer',
      notNull: true,
      references: '"product"',
      onDelete: 'cascade'
    },
    color_id: {
      type: 'integer',
      notNull: true,
      references: '"color"',
      onDelete: 'cascade'
    },
    created_at: 'created_at'
  },
  {
    constraints: {
      primaryKey: ['product_id', 'color_id']
    }
  });

  pgm.createTable('size', {
    id: 'id',
    name: {
      type: 'varchar(8)',
      notNull: true
    }
  });

  pgm.createTable('purchase_order_product',
    {
      product_id: 'integerNotNull',
      color_id: 'integerNotNull',
      purchase_order_id: {
        type: 'integer',
        notNull: true,
        references: '"purchase_order"',
        onDelete: 'cascade'
      },
      size_id: {
        type: 'integer',
        notNull: true,
        references: '"size"',
        onDelete: 'cascade'
      },
      quantity: 'integer'
    },
    {
      constraints: {
        primaryKey: ['product_id', 'color_id', 'purchase_order_id', 'size_id'],
        foreignKeys: {
          columns: ['product_id', 'color_id'],
          references: 'color_product (product_id, color_id)',
          onDelete: 'cascade'
        }
      }
    });

  pgm.createTable('work_purchase_order_product',
    {
      product_id: 'integerNotNull',
      color_id: 'integerNotNull',
      purchase_order_id: 'integerNotNull',
      size_id: 'integerNotNull',
      work_id: {
        type: 'integer',
        notNull: true,
        references: '"work"',
        onDelete: 'cascade'
      },
      quantity: 'integer'
    },
    {
      constraints: {
        primaryKey: ['product_id', 'color_id', 'purchase_order_id', 'size_id', 'work_id'],
        foreignKeys: {
          columns: ['product_id', 'color_id', 'purchase_order_id', 'size_id'],
          references: '"purchase_order_product"',
          onDelete: 'cascade'
        }
      }
    });

  pgm.createTable('assigned_work_product', {
    product_id: 'integerNotNull',
    color_id: 'integerNotNull',
    size_id: 'integerNotNull',
    assigned_work_id: {
      type: 'integer',
      notNull: true,
      references: '"assigned_work"',
      onDelete: 'cascade'
    },
    quantity: 'integer'
  }, {
    constraints: {
      primaryKey: ['product_id', 'color_id', 'size_id']
    }
  });

  pgm.createTable('worker_work_product', {
    product_id: 'integerNotNull',
    color_id: 'integerNotNull',
    size_id: 'integerNotNull',
    worker_work_id: {
      type: 'integer',
      notNull: true,
      references: '"worker_work"',
      onDelete: 'cascade'
    },
    quantity: 'integer'
  }, {
    constraints: {
      primaryKey: ['product_id', 'color_id', 'size_id']
    }
  });
};
