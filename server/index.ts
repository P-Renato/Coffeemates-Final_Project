import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './libs/db';
import userRouter from './routes/userRoutes';
import profileRouter from './routes/profileRoutes';

const app = express();

/* ----------- middlewares ---------------------- */

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


/* --------------- database ------------------------ */

connectDB();

/* -------------------- routers ------------------------  */

app.use('/api/auth/profile', profileRouter);
app.use('/api/auth', userRouter);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

/* ---------------------- error handlers ---------------------- */






app.get('/', (req,res,next) => {
    console.log(req.params)
})



const port = process.env.PORT || 4343;

app.listen(port, () => {
    console.log("Server is running on port ", port)
});
