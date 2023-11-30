import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), PaymentController.getDataById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentController.updateDataById
);

router.post('/', auth(ENUM_USER_ROLE.ADMIN), PaymentController.insertIntoDB);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), PaymentController.getAllFromDB);

export const paymentRoutes = router;
