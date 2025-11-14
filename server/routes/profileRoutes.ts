
import express from 'express';
import { getProfileQuestions, updateProfileAnswers } from '../controllers/profileController';
import { authenticateToken } from '../middlewares/authMiddleware';


const profileRouter = express.Router();

profileRouter.get('/questions', authenticateToken, getProfileQuestions);
profileRouter.patch('/answers', authenticateToken, updateProfileAnswers);


export default profileRouter;