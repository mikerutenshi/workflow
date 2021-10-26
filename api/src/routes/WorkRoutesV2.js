import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import WorkV2 from '../queries/WorkQueriesV2';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), WorkV2.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), WorkV2.getPerProduct);

export default router;
