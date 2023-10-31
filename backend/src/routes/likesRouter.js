import express from 'express';
import {
    getLikes,
    addLike,
    removeLike
} from '../controllers/likesController.js';

const router = express.Router();

/* ChatGPT usage: No */

// Get like
router.get('/:post_id', getLikes);

// Add a like
router.post('/', addLike);

// Removing a like
router.delete('/:post_id', removeLike);

export default router;