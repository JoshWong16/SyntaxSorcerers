// General imports
import express from 'express';
import cors from 'cors';

// Router imports
import userRouter from './routes/userRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json())

app.use('/users', userRouter);

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;