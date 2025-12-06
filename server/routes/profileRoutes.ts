
import express from 'express';
import { getProfileQuestions, updateProfileAnswers, updateUserProfile } from '../controllers/profileController';
import { authenticateToken } from '../middlewares/authMiddleware';


const profileRouter = express.Router();

profileRouter.get('/questions', authenticateToken, (getProfileQuestions as any));
profileRouter.patch('/answers', authenticateToken, (updateProfileAnswers as any));
profileRouter.patch('/update', authenticateToken, (updateUserProfile as any));


export default profileRouter;