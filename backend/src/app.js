// General imports
import express from 'express';
import cors from 'cors';

// Router imports
import userRouter from './routes/userRouter.js';
import likesRouter from './routes/likesRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json())

app.use('/user', userRouter);
app.use('/likes', likesRouter);

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;