import express from 'express';
import { 
  getAllForums, 
  addForum,
  removeForum,
  getUsersForums,
  addUsersForum,
  removeUsersForum,
  sendFirebaseNotification
} from '../controllers/forumController.js';

const router = express.Router();

router.get('/', getAllForums);

router.post('/', addForum);

router.delete('/:forumId', removeForum);

router.get('/user', getUsersForums);

router.post('/user', addUsersForum);

router.delete('/user', removeUsersForum);

router.post('/firebase/notification', sendFirebaseNotification);

export default router;