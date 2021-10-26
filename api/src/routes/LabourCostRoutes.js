import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import LabourCost from '../queries/LabourCostQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), LabourCost.create);
router.patch('/:id', authorize([Role.SUPERUSER]), LabourCost.update);
router.delete('/:id', authorize([Role.SUPERUSER]), LabourCost.delete);

export default router;
