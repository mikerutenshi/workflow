import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import Color from '../queries/ColorQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), Color.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Color.getAll);
router.put('/:id', authorize([Role.SUPERUSER]), Color.update);
router.delete('/', authorize([Role.SUPERUSER]), Color.delete);

export default router;
