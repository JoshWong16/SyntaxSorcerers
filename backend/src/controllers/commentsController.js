import Comments from '../models/Comments.js';
import User from '../models/User.js';
import Posts from '../models/Posts.js';

import pkg from './firebase-config.cjs';
const { admin } = pkg;


async function getComments(req, res) {
    const model = new Comments();
    try {
        const comments = await model.getAllComments(req.params.post_id);
        return res.json(comments);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


async function getComment(req, res) {
    const model = new Comments();
    try {
        const comments = await model.getCommentById(req.params.comment_id);
        return res.json(comments);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* https://medium.com/@jullainc/firebase-push-notifications-to-mobile-devices-using-nodejs-7d514e10dd4 */
async function addComment(req, res) {
    const model = new Comments();
    const userModel = new User();
    const postModel = new Posts();

    try {
        const commentId = await model.addComment(req.body.content, req.body.postId, req.userId);

        const post = await postModel.getPostById(req.body.postId);
        const postUser = userModel.getUser(post.writtenBy);
        const commentUser = userModel.getUser(req.userId);
        const notificationToken = postUser.notification_token;

        const message = `${commentUser.name} has responded to your post.`

        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
    
        const message_notification = {
            notification: {
                title: "Forum Notification",
                body: message
            }
        }

        admin.messaging().sendToDevice(notificationToken, message_notification, notification_options)
        .then( response => {
    
            res.status(200).json({message: "Notification sent successfully for Comment ID: " + commentId});
            
        })
        .catch( error => {
            console.log(error);
        });

       
        return res.json({commentId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    } 
}

async function editComment(req, res) {
    const model = new Comments();
    try {
        const result = await model.editComment(req.body.content, req.params.commentId, req.userId);
        return result ? res.json({message: "comment edited"}) : res.status(403).json({message: "not authorized to edit post"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function deleteComment(req, res) {
    const model = new Comments();
    try {
        const result = await model.deleteComment(req.params.commentId, req.userId);
        return result ? res.json({message: "deleted comment"}) : res.status(403).json({message: "not authorized to delete comment"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export { getComments, getComment, addComment, editComment, deleteComment }