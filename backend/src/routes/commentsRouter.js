import express from 'express';
import {
    getComments,
    getComment,
    addComment,
    editComment,
    deleteComment
} from '../controllers/commentsController.js';

const router = express.Router();

// Get all comment
router.get('/:post_id', getComments);

// Get a comment
router.get('/comment/:comment_id', getComment);

// Create comment
router.post('/', addComment);

// Update comment 
router.put('/:comment_id', editComment);

// Delete comment
router.delete('/:comment_id', deleteComment);

export default router;