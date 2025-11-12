import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const user = express.Router();

user.post('/login', loginUser);
user.post('/register', registerUser);

export default user;