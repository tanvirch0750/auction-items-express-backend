import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './users.controller';

const router = express.Router();

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getDataById);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.updateDataById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.deleteDataById
);
router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllFromDB);

export const userRoutes = router;
