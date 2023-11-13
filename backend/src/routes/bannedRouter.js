import express from 'express';
import {
    getAllBannedUsers,
    getBannedUser,
    addBannedUser
} from '../controllers/bannedController.js';


const router = express.Router();

router.get('/all-users', getAllBannedUsers)

router.get('/user/:userId', getBannedUser);

router.post('/', addBannedUser);

export default router;