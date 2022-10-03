import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import WorkerWork from '../queries/WorkerWorkQueriesV2';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), WorkerWork.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), WorkerWork.getAll);
router.delete('/:id', authorize([Role.SUPERUSER]), WorkerWork.delete);

export default router;
