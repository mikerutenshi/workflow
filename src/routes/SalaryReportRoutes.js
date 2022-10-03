import { Router } from 'express';
import SalaryReport from '../queries/SalaryReportQueries';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const router = Router();

router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), SalaryReport.getAll);
router.get('/:id', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), SalaryReport.getOne);

export default router;
