import { Router } from 'express';
import Worker from '../queries/WorkerQueries';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const router = Router();

router.post(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Worker.create,
);
router.get(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Worker.getAll,
);
router.delete(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Worker.delete,
);
router.put(
  '/:worker_id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Worker.update,
);

export default router;
