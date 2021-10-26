import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import PurchaseOrderProduct from '../queries/PurchaseOrderProductQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), PurchaseOrderProduct.create);
// router.patch('/color-products', authorize([Role.SUPERUSER]), PurchaseOrderProduct.updateColorProduct);
router.patch('/sizes', authorize([Role.SUPERUSER]), PurchaseOrderProduct.updateQuantity);
router.delete('/color-products', authorize([Role.SUPERUSER]), PurchaseOrderProduct.deleteColorProduct);
router.delete('/sizes', authorize([Role.SUPERUSER]), PurchaseOrderProduct.deleteSize);

export default router;
