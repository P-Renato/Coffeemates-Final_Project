import express from 'express'
import { searchMessages, getLastMessagesForUser, getMessagesBetweenUsers } from '../controllers/chatController';
const chat = express.Router();

// get messages between two users
chat.get("/:userId/:otherId", getMessagesBetweenUsers);

// get the last message from each chat for a user
chat.get("/last/:userId", getLastMessagesForUser);

// search messages
chat.get('/search/:userId/:otherId', searchMessages);
export default chat;