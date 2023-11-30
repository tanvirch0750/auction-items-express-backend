import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AuctionWinnerController } from './auctionWinner.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  AuctionWinnerController.getDataById
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  AuctionWinnerController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  AuctionWinnerController.updateDataById
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  AuctionWinnerController.insertIntoDB
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  AuctionWinnerController.getAllFromDB
);

export const auctionWinnerRoutes = router;
