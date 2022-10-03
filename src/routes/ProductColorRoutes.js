import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import ProductColor from '../queries/ProductColorQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), ProductColor.create);
router.delete('/', authorize([Role.SUPERUSER]), ProductColor.delete);

export default router;
