import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import AssignedWork from '../queries/AssignedWorkQueriesV1';

const router = Router();

router.post(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  AssignedWork.create,
);
router.get(
  '/:id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  AssignedWork.getAll,
);
router.delete(
  '/:id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  AssignedWork.delete,
);
router.get(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  AssignedWork.getAssignables,
);

export default router;
