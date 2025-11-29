import express from 'express';
import { searchMessages, getLastMessagesForUser, getMessagesBetweenUsers } from '../controllers/chatController';

const chat = express.Router();

chat.get("/last/:userId", getLastMessagesForUser);

chat.get("/search/:userId/:otherId", searchMessages);

chat.get("/:userId/:otherId", getMessagesBetweenUsers);

export default chat;
