import express from 'express';
import { 
  getAllForums, 
  addForum,
  removeForum,
  getUsersForums,
  addUsersForum,
  removeUsersForum
} from '../controllers/forumController.js';

const router = express.Router();

/* ChatGPT usage: No */

// Get all forums
router.get('/', getAllForums);

// Create forum
router.post('/', addForum);

// Delete forum
router.delete('/forum/:forumId', removeForum);

// Get users forums
router.get('/user', getUsersForums);

// Add users forum
router.post('/user', addUsersForum);

// Remove users forum
router.delete('/user/:forumId', removeUsersForum);

export default router;