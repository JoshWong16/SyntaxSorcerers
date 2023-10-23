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

router.get('/', getAllForums);

router.post('/', addForum);

router.delete('/:forumId', removeForum);

router.get('/user', getUsersForums);

router.post('/user', addUsersForum);

router.delete('/user', removeUsersForum);

export default router;