import express from 'express';

const router = express.Router();

// Define User module routes and handlers
router.get('/:forumId', (req, res) => {
  res.send('Posts Module')
});

router.post('/', (req, res) => {
    // Create new post
    res.send('creating new post');
})

router.delete('/:postId', (req, res) => {
    // Delete post by ID
    res.send('deleting post by ID');
});

router.put('/:postId', (req, res) => {
    // Update post by ID
    res.send('updating post by ID');
});

export default router;