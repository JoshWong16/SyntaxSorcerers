import express from 'express';
import {
    getAllPosts,
    getPostById,
    addPost,
    deletePost,
    editPost
} from '../controllers/postController.js';

/* ChatGPT usage: No */

const router = express.Router();

router.get('/post/:postId', getPostById);

router.get('/forum/:forumId', getAllPosts);

router.post('/', addPost);

router.delete('/:postId', deletePost);

router.put('/:postId', editPost);

export default router;