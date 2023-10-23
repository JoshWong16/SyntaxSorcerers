import express from 'express';
import fs from 'fs';

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

router.get('/courseKeywords', (req, res) => {
    /* User will communicate their interests by selecting a bunch of keywords */

    fs.readFile('./src/jsonFiles/keywords.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file: ' + err);
            return;
        }

        res.send(data);
        
    });

});

/* req must contain a json body of keywords like {"keywords" : ["power", "wires"]} */
router.get('/reccomendedCourses', (req, res) => {
    const userKeywords = req.body["keywords"];

    var categoriesArray = [];
    var reccomendedCoursesArray = [];

    fs.readFile('./src/jsonFiles/keywords.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file: ' + err);
            return;
        }

        const jsonData = JSON.parse(data);

        Object.keys(jsonData).forEach(category => {
            const keywordsArray = jsonData[category];

            keywordsArray.forEach((keyword, index) => {

                if (userKeywords.includes(keyword)) {
                    
                    categoriesArray.push(category);
                }

            })

        });

    fs.readFile('./src/jsonFiles/courseCategories.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file: ' + err);
            return;
        }

        const jsonData = JSON.parse(data);

        Object.keys(jsonData).forEach(category => {
            if (categoriesArray.includes(category)) {
                
                reccomendedCoursesArray.push(...jsonData[category]);

            }
        })

        res.json(reccomendedCoursesArray);

    })

    


        
        
    });



})

export default router;