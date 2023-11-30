import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { validationSchema } from './category.validation';

const router = express.Router();

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), CategoryController.getDataById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(validationSchema.update),
  CategoryController.updateDataById
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(validationSchema.create),
  CategoryController.insertIntoDB
);

router.get('/', CategoryController.getAllFromDB);

export const categoryRoutes = router;
