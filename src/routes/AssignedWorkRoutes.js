import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import AssignedWork from '../queries/AssignedWorkQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), AssignedWork.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), AssignedWork.getAll);

export default router;
