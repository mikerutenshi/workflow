import { Router } from 'express';
import Work from '../queries/WorkQueries';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const router = Router();

router.post('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Work.create);
router.get(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Work.getAll,
);
router.get(
  '/:worker_id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Work.getPerWorker,
);
router.get(
  '/unassigned/:worker_id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Work.getUnassigned,
);
router.delete('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), Work.delete);
router.put(
  '/:work_id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE]),
  Work.update,
);

export default router;
