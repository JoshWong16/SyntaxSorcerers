// General imports
import express from 'express';
import cors from 'cors';

// Router imports
import userRouter from './routes/userRouter.js';
import forumRouter from './routes/forumRouter.js';
import postRouter from './routes/postRouter.js';
import likesRouter from './routes/likesRouter.js';
import commentsRouter from './routes/commentsRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json())

app.use('/users', userRouter);
app.use('/forums', forumRouter);
app.use('/posts', postRouter);
app.use('/likes', likesRouter);
app.use('/comments', commentsRouter);

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;