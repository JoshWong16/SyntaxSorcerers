import express from 'express';

const router = express.Router();

// Get user by ID
router.get('/:id', (req, res) => {
  // Get user by ID
  res.send('getting user by ID')
});

// Create user
router.post('/', (req, res) => {
    // Create user
  res.send('creating user')
});

// Post user by ID
router.put('/:id', (req, res) => {
    // Update user
  res.send('updating user')
});

router.delete('/:id', (req, res) => {
    // Delete user
  res.send('deleting user')
});

export default router;