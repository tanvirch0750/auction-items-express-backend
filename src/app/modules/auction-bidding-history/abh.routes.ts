import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AbhController } from './abh.controller';

const router = express.Router();

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), AbhController.getDataById);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), AbhController.deleteDataById);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), AbhController.updateDataById);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AbhController.insertIntoDB
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), AbhController.getAllFromDB);

export const abhRoutes = router;
