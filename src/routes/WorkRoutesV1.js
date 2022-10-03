import { Router } from 'express';
import Work from '../queries/WorkQueriesV1';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const workRouter = Router();
const workerWorkRouter = Router({ mergeParams: true });
const assignedWorkRouter = Router({ mergeParams: true });

workRouter.get(
  '/',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  Work.getAll,
);
workRouter.use(
  '/:id/done-work',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  workerWorkRouter,
);
workRouter.use(
  '/:id/assigned-work',
  authorize([Role.SUPERUSER, Role.ADMIN_PRICE, Role.ADMIN_WORK, Role.ADMIN_QA]),
  assignedWorkRouter,
);

workerWorkRouter.get('/', Work.getOneWorkerWork);
assignedWorkRouter.get('/', Work.getOneAssignedWork);

export default workRouter;
