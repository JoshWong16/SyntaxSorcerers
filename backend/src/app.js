// General imports
import express from 'express';
import cors from 'cors';

// Router imports
import userRouter from './routes/userRouter.js';
import forumRouter from './routes/forumRouter.js';
import postRouter from './routes/postRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json())

app.use('/users', userRouter);
app.use('/forums', forumRouter);
app.use('/posts', postRouter);

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;