import express from 'express';
import { categoryRoutes } from '../modules/category/category.routes';
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
];

// Application Routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
