import { Router } from 'express';
import WorkerWork from '../queries/WorkerWorkQueries';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const router = Router();

// router.post('/', authorize([Role.SUPERUSER, Role.ADMIN_WORK, Role.ADMIN_QA]), WorkerWork.create);
router.get(
  '/:worker_id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  WorkerWork.getAll,
);
router.delete(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  WorkerWork.delete,
);

export default router;
