// General imports
import express from 'express';
import cors from 'cors';

// App setup
const app = express();
app.use(cors());
app.use(express.json())

// Ping route
app.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

export default app;