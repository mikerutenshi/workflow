import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import Size from '../queries/SizeQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), Size.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Size.getAll);
router.put('/:id', authorize([Role.SUPERUSER]), Size.update);
router.delete('/', authorize([Role.SUPERUSER]), Size.delete);

export default router;
