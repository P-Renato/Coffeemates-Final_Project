import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cookieParser from 'cookie-parser';
import connectDB from './libs/db';
import userRouter from './routes/userRoutes';
import profileRouter from './routes/profileRoutes';
import commentRouter from './routes/commentRoutes'
import postRouter from './routes/postRoutes';
import authRouter from './routes/authRoutes';
import passport from './utils/passport';
import locationRouter from './routes/locationRoutes';
import geocodeRouter from './routes/geocodeRoutes'
import chatRouter from './routes/chatRoutes';
import { initChatSocket } from './controllers/chatController';

const app = express();

/* ----------- middlewares ---------------------- */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173' || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// chat socket
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

/* --------------- connect database ------------------------ */

connectDB();

/* -------------------- routers ------------------------  */

app.use('/api/auth/profile', profileRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth', userRouter);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
})

// post route
app.use("/api/post", postRouter); 

// comment route
app.use("/api/comment", commentRouter);

// get location of all posts
app.use("/api/location", locationRouter);

// change from address to marker in map
app.use("/api/geocode", geocodeRouter);

// chat route
initChatSocket(io);  // Initialize chat sockets
app.use("/api/chat", chatRouter);

/* ---------------------- error handlers ---------------------- */

const port = process.env.PORT || 4343;

// Start the HTTP server (with Express + Socket.IO)
httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

