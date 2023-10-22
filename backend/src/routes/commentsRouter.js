import express from 'express';

const router = express.Router();

// Get comment
router.get('/:post_id', (req, res) => {
    res.send('getting comment by post_id');
});

// Create comment
router.post('/', (req, res) => {
    res.send('creating comment');
});

// Delete comment
router.delete('/:comment_id', (req, res) => {
    res.send('deleting comment by post_id');
});

// Update comment 
router.put('/:comment_id', (req, res) => {
    res.send('updating comment by post_id');
});

export default router;