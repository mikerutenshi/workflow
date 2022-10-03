import { Router } from 'express';
import User from '../queries/UserQueries';
import authorize from '../middleware/Authorize';
import Role from '../helpers/role';

const router = Router();

router.post('/', User.create);
router.get('/', authorize(Role.SUPERUSER), User.getAll);
router.delete('/', authorize(Role.SUPERUSER), User.delete);
router.post('/authenticate', User.authenticate);
router.post('/token', User.refreshToken);
router.post('/signout', User.signOut);
router.patch('/:id', authorize(Role.SUPERUSER), User.changeActiveStatus);
router.put('/:id', authorize(Role.SUPERUSER), User.update);

export default router;
