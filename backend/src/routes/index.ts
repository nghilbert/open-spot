import { Router } from 'express';
import userRoutes from './user.routes.ts';

const router = Router();

router.use('/user', userRoutes);

export default router;