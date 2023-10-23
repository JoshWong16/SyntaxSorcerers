import express from 'express';
import {
    getComments,
    addComment,
    editComment,
    deleteComment
} from '../controllers/commentsController.js';

const router = express.Router();

// Get comment
router.get('/:post_id', getComments);

// Create comment
router.post('/', addComment);

// Update comment 
router.put('/:comment_id', editComment);

// Delete comment
router.delete('/:comment_id', deleteComment);

export default router;