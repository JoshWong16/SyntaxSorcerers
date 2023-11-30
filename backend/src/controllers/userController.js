import User from '../models/User.js';
import UserCourses from '../models/UserCourses.js';
import fs from 'fs';
import natural from 'natural';
import coursesData from '../jsonFiles/courses.json' assert { type: 'json' };

/* ChatGPT usage: No */
export async function getUser(req, res) {
    const model = new User();
    try {
        const user = await model.getUser(req.userId);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function createUser(req, res) {
    const model = new User();
    try {
        if (req.body.email == null || req.body.year_level == null || req.body.major == null || req.body.name == null) {
            return res.status(400).json({message: 'Missing required fields, can not create user'});
        }
        const user = {
            userId: req.userId,
            email: req.body.email,
            year_level : req.body.year_level,
            major : req.body.major,
            name : req.body.name,
            notification_token : req.body.notification_token || null,
            isAdmin: false
        };
        await model.createUser(user);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function updateUser(req, res) {
    const model = new User();
    if (req.body == null || Object.keys(req.body).length === 0) {
        return res.status(400).json({message: 'Body is empty, can not update user'});
    }
    try {
        const foundUser = await model.updateUser(req.userId, req.body)
        if(!foundUser) {
            return res.status(404).json({message: 'User does not exist'});
        };
        
        return res.json({message: 'User updated'});
    } catch (error) {  
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function deleteUser(req, res) {
    const model = new User();
    try {
        const isUserDeleted = await model.deleteUser(req.userId);
        if(!isUserDeleted) {
            return res.status(404).json({message: 'User does not exist'});
        };
        res.json({message:'User deleted'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function addFavouriteCourse(req, res) {
    const model = new UserCourses();
    try {
        if(!req.body.courseId) {
            return res.status(400).json({message: 'Missing required fields, can not add course to favourites'});
        }
        await model.addUserCourse(req.userId, req.body.courseId);
        return res.json({message:'Course added'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

/* ChatGPT usage: No */
export async function getFavouriteCourses(req, res) {
    const model = new UserCourses();
    try {
        const courses = await model.getUserCourses(req.userId);
        return res.json(courses);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function removeFavouriteCourse(req, res) {
    const model = new UserCourses();
    const course_id = req.params.course_id;
    try {
        const courseDeletedExists = await model.removeUserCourse(req.userId, course_id);
        if(!courseDeletedExists) {
            return res.status(404).json({message: 'Course was not favourited for user'});
        }
        return res.json({message: 'Course removed'});;
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: Partial */
export async function getCourseKeywords(req, res) {

    /* User will communicate their interests by selecting a bunch of keywords */

    fs.readFile('./src/jsonFiles/courseCategories.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file: ' + err);
            return res.status(500).json({message: err});
        }

        var categories = [];
        const jsonData = JSON.parse(data);

        Object.keys(jsonData).forEach(category => {
            categories.push(category);
        })

        res.json(categories);
        
    });
}

/* ChatGPT usage: Partial */
export async function getRecommendedCourses(req, res) {
    const userKeywords = req.query.userKeywords;
    console.log(userKeywords);
    const userKeywordsArray = userKeywords ? userKeywords.split(',') : null;
    var recommendedCourses = {};

    if (Array.isArray(userKeywordsArray)) {
        fs.readFile('./src/jsonFiles/courseCategories.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the JSON file: ' + err);
                return res.status(500).json({message: err});
            }
    
            const jsonData = JSON.parse(data);
    
            for (var i = 0; i < userKeywordsArray.length; i++) {
                var category = userKeywordsArray[i];
                if (jsonData[category]) {
                    recommendedCourses[category] = jsonData[category];
                }
            }
    
            return res.json(recommendedCourses);
        })
    } else {
        return res.status(400).json({message: "Missing required keywords"})
    }
}

/* ChatGPT usage: Partial */
export async function getRecommendedCoursesCustomKeywords(req, res) {
    const userKeywords = req.query.userKeywords;
    const userKeywordsArray = userKeywords ? userKeywords.split(',') : null;
    const courses = coursesData.courses;
    var recommendedCourses = {'courses': []}

    if (Array.isArray(userKeywordsArray)) {

        function processKeywords(keyword) {
            const tokenizer = new natural.WordTokenizer();
            const stemmedKeywords = natural.PorterStemmer.tokenizeAndStem(keyword);
            return stemmedKeywords;
        }

        function searchCourses(keyword) {
            const processedKeywords = processKeywords(keyword);

            const matchingCourses = courses.filter(course => {
                const courseKeywords = processKeywords(course);
                return courseKeywords.some(keyword => processedKeywords.includes(keyword));
            });

            return matchingCourses;
        }
        for (const keyword of userKeywordsArray) {
            var matchedCourses = searchCourses(keyword);

            for (const course of matchedCourses) {
                if (!recommendedCourses['courses'].includes(course)) {
                    recommendedCourses['courses'].push(course);
                }
            }
        }
        return res.json(recommendedCourses);
    } else {
        return res.status(400).json({message: "Missing required keywords"})
    }
}