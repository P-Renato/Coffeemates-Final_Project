import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './libs/db';
import userRouter from './routes/userRoutes';
import profileRouter from './routes/profileRoutes';
import commentRouter from './routes/commentRoutes'
import postRouter from './routes/postRoutes'

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
app.use(express.urlencoded({ extended: true }));


/* --------------- database ------------------------ */

connectDB();

/* -------------------- routers ------------------------  */

app.use('/api/auth/profile', profileRouter);
app.use('/api/auth', userRouter);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
})

app.use("/api/post", postRouter);

app.use("/api/comment", commentRouter);

// map
app.get("/geocode", async (req, res) => {
    const address = req.query.address;

    if (!address) return res.status(400).send({ error: "Missing address" });

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Coffeemates/1.0 (dcistudentcoffemates@gmail.com)",
            },
        });

        if (!response.ok) {
            console.error("Nominatim error:", response.statusText);
            return res.status(500).send({ error: "Failed to fetch from Nominatim" });
        }

        const data = await response.json();
        res.send(data);
    } catch (err) {
        console.error("Geocode route error:", err);
        res.status(500).send({ error: "Failed to fetch from Nominatim" });
    }
});



/* ---------------------- error handlers ---------------------- */






app.get('/', (req, res, next) => {
    console.log(req.params)
})



const port = process.env.PORT || 4343;

app.listen(port, () => {
    console.log("Server is running on port ", port)
})
