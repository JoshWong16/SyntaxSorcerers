import User from '../models/User.js';
import UserCourses from '../models/UserCourses.js';
import fs from 'fs';

/* ChatGPT usage: No */
async function getUser(req, res) {
    const model = new User();
    try {
        const user = await model.getUser(req.userId);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function createUser(req, res) {
    const model = new User();
    try {
        const user = {
            userId: req.userId,
            email: req.body.email || "",
            year_level : req.body.year_level || "",
            major : req.body.major || "",
            name : req.body.name || "",
            notification_token : req.body.notification_token || ""
        };
        await model.createUser(user);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function updateUser(req, res) {
    const model = new User();
    try {
        await model.updateUser(req.userId, req.body);
        res.json({message: 'User updated'});
    } catch (error) {  
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function deleteUser(req, res) {
    const model = new User();
    try {
        await model.deleteUser(req.userId);
        res.json({message:'User deleted'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function addFavouriteCourse(req, res) {
    const model = new UserCourses();
    try {
        const courses = await model.addUserCourse(req.userId, req.body.courseId);
        return res.json({message:'Course added'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

/* ChatGPT usage: No */
async function getFavouriteCourses(req, res) {
    const model = new UserCourses();
    try {
        const courses = await model.getUserCourses(req.userId);
        return res.json(courses);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function removeFavouriteCourse(req, res) {
    const model = new UserCourses();
    const course_id = req.params.course_id;
    try {
        await model.removeUserCourse(req.userId, course_id);
        return res.json({message: 'Course removed'});;
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: Partial */
async function getCourseKeywords(req, res) {

    /* User will communicate their interests by selecting a bunch of keywords */

    fs.readFile('./src/jsonFiles/courseCategories.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file: ' + err);
            return;
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
async function getRecommendedCourses(req, res) {

    const { userKeywords } = req.query;
    
    const userKeywordsArray = userKeywords.split(',');
    var reccomendedCourses = {};

    if (Array.isArray(userKeywordsArray)) {
        
        fs.readFile('./src/jsonFiles/courseCategories.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the JSON file: ' + err);
                return;
            }
    
            const jsonData = JSON.parse(data);
    
            for (var i = 0; i < userKeywordsArray.length; i++) {
                var category = userKeywordsArray[i];
                if (jsonData[category]) {
                    reccomendedCourses[category] = jsonData[category];
    
                }
            }
    
            res.json(reccomendedCourses);
    
        })

    } else {
        
        res.status(400).send("Invalid parameter.")
    }
}

/* ChatGPT usage: No */
async function getUserInterests(req, res) {
    const model = new UserInterests();
    try {
        const interests = await model.getUserInterests(req.userID);
        return res.json(interests)
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function addUserInterests(req, res) {
    const model = new getUserInterests();
    try {
        const interests = await model.addUserInterest(req.userID, req.body.interests);
        return res.json({message: 'Interests added'})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function removeUserInterests(req, res) {
    const model = new getUserInterests();
    const interests = req.params.interests;
    try {
        await model.removeUserInterests(req.userID, interests);
        return res.json({message: 'Interests removed'})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export { getUser, createUser, updateUser, deleteUser, addFavouriteCourse, getFavouriteCourses, removeFavouriteCourse, getCourseKeywords, getRecommendedCourses, getUserInterests, addUserInterests, removeUserInterests };