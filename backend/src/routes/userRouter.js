import express from 'express';

import { 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    addFavouriteCourse,
    getFavouriteCourses,
    removeFavouriteCourse
} from '../controllers/userController.js';

const router = express.Router();

// Get user by ID
router.get('/', getUser);

// Create user
router.post('/', createUser);

// Post user by ID
router.put('/', updateUser);

router.delete('/', deleteUser);

router.get('/favourite', getFavouriteCourses);

router.post('/favourite', addFavouriteCourse);

router.delete('/favourite/:course_id', removeFavouriteCourse);

export default router;