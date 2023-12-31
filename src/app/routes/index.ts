import express from 'express';
import { abhRoutes } from '../modules/auction-bidding-history/abh.routes';
import { auctionWinnerRoutes } from '../modules/auction-winner/auctionWinner.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { paymentRoutes } from '../modules/payment/payment.routes';
import { messageRoutes } from '../modules/product-message/message.routes';
import { productRoutes } from '../modules/product/product.routes';
import { authRoutes } from '../modules/users/auth.routes';
import { profileRoutes } from '../modules/users/profile.routes';
import { userRoutes } from '../modules/users/users.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
  {
    path: '/auction-winner',
    route: auctionWinnerRoutes,
  },
  {
    path: '/abh',
    route: abhRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
];

// Application Routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
