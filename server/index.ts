import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req,res,next) => {
    console.log(req.params)
})



const port = process.env.PORT || 4343;

app.listen(port, () => {
    console.log("Server is running on port ", port)
});
