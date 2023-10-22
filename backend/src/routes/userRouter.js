import express from 'express';

const router = express.Router();

// Get user by ID
router.get('/:id', (req, res) => {
    res.send('getting user by ID')
});

// Create user
router.post('/', (req, res) => {
    res.send('creating user')
});

// Post user by ID
router.put('/:id', (req, res) => {
    res.send('updating user')
});

router.delete('/:id', (req, res) => {
    res.send('deleting user')
});

export default router;