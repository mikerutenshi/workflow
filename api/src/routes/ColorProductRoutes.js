import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import ColorProduct from '../queries/ColorProductQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), ColorProduct.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), ColorProduct.getAll);
router.put('/:id', authorize([Role.SUPERUSER]), ColorProduct.update);
router.delete('/:id', authorize([Role.SUPERUSER]), ColorProduct.delete);

export default router;
