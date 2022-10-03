import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import DoneWork from '../queries/DoneWorkQueriesV1';

const router = Router();
const doneableRouter = Router({ mergeParams: true });

router.post(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  DoneWork.create,
);
router.get(
  '/:id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  DoneWork.getAll,
);
router.delete(
  '/:id',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  DoneWork.delete,
);
router.use(
  '/:id/doneables',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  doneableRouter,
);

doneableRouter.get('/', DoneWork.getDonables);

export default router;
