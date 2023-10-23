import express from 'express';

import { 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    addFavouriteCourse,
    getFavouriteCourses,
    removeFavouriteCourse,
    getCourseKeywords,
    getRecommendedCourses
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

router.get('/courseKeywords', getCourseKeywords);

/* req must contain a json body of keywords like {"keywords" : ["power", "wires"]} */
router.get('/reccomendedCourses', getRecommendedCourses);

export default router;