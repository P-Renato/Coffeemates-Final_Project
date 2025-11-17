import express from 'express';

import { registerUser, loginUser, getCurrentUser, getUserById, getAllUsers, updateUser, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';


const userRouter = express.Router();



userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/:id', getUserById); 
userRouter.get('/', getAllUsers);


userRouter.get('/profile/me', authenticateToken, getCurrentUser);
userRouter.patch('/profile/update', authenticateToken, updateUser);
userRouter.patch('/password/change', authenticateToken, changePassword);

export default userRouter;