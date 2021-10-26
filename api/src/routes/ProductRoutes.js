import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import Product from '../queries/ProductQueries';

const router = Router();
const dirPath = path.resolve(__dirname, '../../temp/');
const upload = multer({ dest: dirPath });

router.post('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Product.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Product.getAll);
router.delete(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE]),
  Product.delete,
);
router.put(
  '/:product_id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE]),
  Product.update,
);
router.get('/export-csv', authorize([Role.SUPERUSER]), Product.exportCsv);
router.post(
  '/import-csv',
  authorize([Role.SUPERUSER]),
  upload.single('product_import'),
  Product.importCsv,
);

export default router;
