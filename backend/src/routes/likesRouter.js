import express from 'express';

const router = express.Router();

// Get like
router.get('/:post_id', (req, res) => {
    res.send('getting like by post_id');
});

// Create like
router.post('/', (req, res) => {
    res.send('creating like');
});

// Delete like
router.delete('/:post_id', (req, res) => {
    res.send('deleting like by post_id');
});

export default router;