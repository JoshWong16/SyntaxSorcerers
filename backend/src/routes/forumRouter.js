import express from 'express';

const router = express.Router();

// Define User module routes and handlers
router.get('/', (req, res) => {
  res.send('Forum Module')
});

router.get('/joined', (req, res) => {
  // Get user by ID
  res.send('getting user joined forums');
});

router.post('/', (req, res) => {
    // Create new forum
    res.send('creating new forum');
});

router.delete('/:forumId', (req, res) => {
    // Delete forum by ID
    res.send('deleting forum by ID');
});

router.post('/user', (req, res) => {
    // Add user to forum
    res.send('adding user to forum');
});

export default router;