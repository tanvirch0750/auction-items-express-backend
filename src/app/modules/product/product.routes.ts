import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { validationSchema } from './product.validation';

const router = express.Router();

router.get('/:id', ProductController.getDataById);
router.get('/:categoryId/category', ProductController.getProductByCategory);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.updateDataById
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(validationSchema.create),
  ProductController.insertIntoDB
);

router.get(
  '/',

  ProductController.getAllFromDB
);

export const productRoutes = router;
