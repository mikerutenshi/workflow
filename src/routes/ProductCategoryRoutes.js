import { Router } from 'express';

import authorize from '../middleware/Authorize';
import Role from '../helpers/role';
import ProductCategory from '../queries/ProductCategoryQueries';

const router = Router();

router.post('/', authorize([Role.SUPERUSER]), ProductCategory.create);
router.get('/', authorize([Role.SUPERUSER, Role.ADMIN_PRICE]), ProductCategory.getAll);
router.put('/:id', authorize([Role.SUPERUSER]), ProductCategory.update);
router.delete('/', authorize([Role.SUPERUSER]), ProductCategory.delete);

export default router;
