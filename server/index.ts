import express from 'express';
import cors from 'cors';
import path from 'path';
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

/* --------------- connect database ------------------------ */

connectDB();

/* -------------------- routers ------------------------  */

// Add this at the top of your authRouter.ts, before the Google routes
authRouter.get('/test', (req, res) => {
    res.json({ message: 'Auth router is working!' });
});

app.use('/api/auth/profile', profileRouter);
app.use('/api/auth', userRouter);
app.use('api//auth', authRouter);

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


/* ---------------------- error handlers ---------------------- */

app.get('/', (req, res, next) => {
    console.log(req.params)
})

const port = process.env.PORT || 4343;

app.listen(port, () => {
    console.log("Server is running on port ", port)
})
