import { Router } from 'express';
import WorkerReport from '../queries/WorkerReportQueries';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const router = Router();

router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), WorkerReport.getReport);
router.get('/:worker_id', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), WorkerReport.getWorkDetail);

export default router;
