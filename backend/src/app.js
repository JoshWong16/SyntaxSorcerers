// General imports
import express from 'express';
import cors from 'cors';

// Router imports
import userRouter from './routes/userRouter.js';
import likesRouter from './routes/likesRouter.js';
import commentsRouter from './routes/commentsRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json())

// Router setup
app.use('/user', userRouter);
app.use('/likes', likesRouter);
app.use('/comments', commentsRouter);

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;