"use strict";

var QueryFile = require('pg-promise').QueryFile;

var path = require('path');

function sql(file) {
  var fullPath = path.join(path.resolve('./sql'), file);
  return new QueryFile(fullPath, {
    minify: true
  });
}

module.exports = {
  workerReport: {
    view: sql('workerReport/view.sql'),
    report: sql('workerReport/report.sql'),
    sum: sql('workerReport/sum.sql'),
    sumQty: sql('workerReport/sumQuantity.sql'),
    getWorkDetail: sql('workerReport/getWorkDetail.sql')
  },
  salaryReport: {
    getAll: sql('salary-report/get-all.sql'),
    getOne: sql('salary-report/get-one.sql')
  },
  product: {
    create: sql('product/create.sql')
  },
  user: {
    create: sql('user/create.sql'),
    update: sql('user/update.sql')
  },
  productCategory: {
    create: sql('product-category/create.sql'),
    getAll: sql('product-category/get-all.sql'),
    update: sql('product-category/update.sql'),
    "delete": sql('product-category/delete.sql')
  },
  color: {
    create: sql('color/create.sql'),
    getAll: sql('color/get-all.sql'),
    update: sql('color/update.sql'),
    "delete": sql('color/delete.sql')
  },
  colorProduct: {
    create: sql('color-product/create.sql'),
    getAll: sql('color-product/get-all.sql'),
    update: sql('color-product/update.sql'),
    "delete": sql('color-product/delete.sql')
  },
  labourCost: {
    create: sql('labour-cost/create.sql'),
    update: sql('labour-cost/update.sql'),
    "delete": sql('labour-cost/delete.sql')
  },
  productColor: {
    create: sql('product-color/create.sql'),
    update: sql('product-color/update.sql'),
    "delete": sql('product-color/delete.sql')
  },
  customer: {
    create: sql('customer/create.sql'),
    getAll: sql('customer/get-all.sql'),
    update: sql('customer/update.sql'),
    "delete": sql('customer/delete.sql')
  },
  purchaseOrder: {
    create: sql('purchase-order/create.sql'),
    getAll: sql('purchase-order/get-all.sql'),
    getOne: sql('purchase-order/get-one.sql'),
    update: sql('purchase-order/update.sql'),
    "delete": sql('purchase-order/delete.sql')
  },
  purchaseOrderProduct: {
    create: sql('purchase-order-product/create.sql'),
    updateColorProduct: sql('purchase-order-product/update-color-product.sql'),
    updateQuantity: sql('purchase-order-product/update-quantity.sql'),
    deleteColorProduct: sql('purchase-order-product/delete-color-product.sql'),
    deleteSize: sql('purchase-order-product/delete-size.sql')
  },
  size: {
    create: sql('size/create.sql'),
    getAll: sql('size/get-all.sql'),
    update: sql('size/update.sql'),
    "delete": sql('size/delete.sql')
  },
  work: {
    create: sql('work/create.sql'),
    getPerProduct: sql('work/get-per-product.sql')
  },
  workV1: {
    getAll: sql('work/get-all_v1.sql'),
    getOneWorkerWork: sql('work/get-one-worker-work.sql'),
    getOneAssignedWork: sql('work/get-one-assigned-work.sql')
  },
  workPurchaseOrderProduct: {
    create: sql('work-purchase-order-product/create.sql')
  },
  assignedWork: {
    create: sql('assigned-work/create.sql'),
    getAll: sql('assigned-work/get-all.sql')
  },
  assignedWorkV1: {
    create: sql('assigned-work/create_v1.sql'),
    getAll: sql('assigned-work/get-all_v1.sql'),
    "delete": sql('assigned-work/delete_v1.sql'),
    getAssignables: sql('assigned-work/get-assignables.sql')
  },
  doneWorkV1: {
    create: sql('done-work/create_v1.sql'),
    getAll: sql('done-work/get-all_v1.sql'),
    "delete": sql('done-work/delete_v1.sql'),
    getDonables: sql('done-work/get-donables.sql')
  },
  assignedWorkProduct: {
    create: sql('assigned-work-product/create.sql')
  },
  workerWork: {
    create: sql('worker-work/create.sql'),
    getAll: sql('worker-work/get-all.sql'),
    "delete": sql('worker-work/delete.sql')
  },
  workerWorkProduct: {
    create: sql('worker-work-product/create.sql')
  }
};