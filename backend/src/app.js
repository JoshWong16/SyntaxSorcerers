/* ChatGPT usage: No */
// General imports
import express from 'express';
import cors from 'cors';

// middleware imports
import { getUserId } from './middleware/getUserId.js';

// Router imports
import userRouter from './routes/userRouter.js';
import forumRouter from './routes/forumRouter.js';
import postRouter from './routes/postRouter.js';
import likesRouter from './routes/likesRouter.js';
import commentsRouter from './routes/commentsRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', getUserId, userRouter);
app.use('/forums', getUserId, forumRouter);
app.use('/posts', getUserId, postRouter);
app.use('/comments', getUserId, commentsRouter);
app.use('/likes', getUserId, likesRouter);

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;