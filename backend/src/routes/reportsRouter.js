import express from 'express';
import {
    getAllUsersReports,
    getUserReports,
    addReport
} from '../controllers/reportsController.js';

/* ChatGPT usage: No */

const router = express.Router();

router.get('/all-users', getAllUsersReports);

router.get('/user/:userId', getUserReports);

router.post('/', addReport);

export default router;