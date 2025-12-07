import express from 'express';
import { registerUser, loginUser, getCurrentUser, getUserById, getAllUsers, updateUser, changePassword, deleteUser, updateUserStatus, searchUsers } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/', getAllUsers);
userRouter.get('/search', searchUsers)


userRouter.get('/profile/me', authenticateToken, getCurrentUser);
userRouter.patch('/profile/update', authenticateToken, updateUser);
userRouter.patch('/password/change', authenticateToken, changePassword);

userRouter.get('/:id', getUserById); 

userRouter.delete('/:id', authenticateToken, deleteUser)
userRouter.patch('/:id/status', updateUserStatus);

userRouter.get('/search', searchUsers);

export default userRouter;