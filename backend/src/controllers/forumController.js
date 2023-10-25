import Forum from '../models/Forums.js';
import UserForums from '../models/UserForums.js';

import pkg from './firebase-config.cjs';
const { admin } = pkg;

async function getAllForums(req, res) {
    const forumModel = new Forum();
    try {
        const forums = req.query.search ? await forumModel.searchForums(req.query.search) : await forumModel.getAllForums();
        return res.json(forums);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

async function addForum(req, res) {
    const forumModel = new Forum();
    try {
        const forumId = await forumModel.addForum(req.body.name, req.userId, req.body.course);
        return res.json({forumId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

async function removeForum(req, res) {
    const forumModel = new Forum();
    try {
        const result = await forumModel.deleteForum(req.userId, req.params.forumId);
        return result ? res.json({message: "deleted forum"}) : res.status(403).json({message: "not authorized to delete forum"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

async function getUsersForums(req, res) {
    const userForumsModel = new UserForums();
    try {
        const forums = await userForumsModel.getUsersForums(req.userId);
        return res.json(forums);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

async function addUsersForum(req, res) {
    const userForumsModel = new UserForums();
    try {
        await userForumsModel.addUserForum(req.userId, req.body.forumId);
        return res.json({message:"added user to forum"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function removeUsersForum(req, res) {
    const userForumsModel = new UserForums();
    try {
        await userForumsModel.removeUserForum(req.userId, req.body.forumId);
        return res.json({message: "removed user from forum"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


/* https://medium.com/@jullainc/firebase-push-notifications-to-mobile-devices-using-nodejs-7d514e10dd4 */
async function sendFirebaseNotification(req, res) {

    /* just a skeleton will need edits later */

    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };
    
      const  registrationToken = req.body.registrationToken;
      const message = req.body.message;
      const options =  notification_options
      
        admin.messaging().sendToDevice(registrationToken, message, options)
        .then( response => {
    
         res.status(200).json({message: "Notification sent successfully"});
         
        })
        .catch( error => {
            console.log(error);
        });
}

export { getAllForums, addForum, removeForum, getUsersForums, addUsersForum, removeUsersForum, sendFirebaseNotification };