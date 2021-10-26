import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import PurchaseOrder from '../queries/PurchaseOrderQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), PurchaseOrder.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), PurchaseOrder.getAll);
router.get('/:id', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), PurchaseOrder.getOne);
router.put('/:id', authorize([Role.SUPERUSER]), PurchaseOrder.update);
router.delete('/:id', authorize([Role.SUPERUSER]), PurchaseOrder.delete);

export default router;
