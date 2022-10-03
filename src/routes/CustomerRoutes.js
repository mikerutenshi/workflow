import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import Customer from '../queries/CustomerQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), Customer.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Customer.getAll);
router.put('/:id', authorize([Role.SUPERUSER]), Customer.update);
router.delete('/:id', authorize([Role.SUPERUSER]), Customer.delete);

export default router;
