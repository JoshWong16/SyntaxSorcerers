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
import reportsRouter from './routes/reportsRouter.js';
import bannedRouter from './routes/bannedRouter.js';

// App setup
const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', getUserId, userRouter);
app.use('/forums', getUserId, forumRouter);
app.use('/posts', getUserId, postRouter);
app.use('/comments', getUserId, commentsRouter);
app.use('/likes', getUserId, likesRouter);
app.use('/reports', getUserId, reportsRouter);
app.use('/banned', getUserId, bannedRouter);

// testing 

export default app;