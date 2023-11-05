import Forum from '../models/Forums.js';
import UserForums from '../models/UserForums.js';

/* ChatGPT usage: No */
export async function getAllForums(req, res) {
    const forumModel = new Forum();
    try {
        const forums = req.query.search ? await forumModel.searchForums(req.query.search) : await forumModel.getAllForums();
        return res.json(forums);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

/* ChatGPT usage: No */
export async function addForum(req, res) {
    const forumModel = new Forum();
    const userForumsModel = new UserForums();
    try {
        const forumId = await forumModel.addForum(req.body.name, req.userId, req.body.course);
        await userForumsModel.addUserForum(req.userId, forumId);
        return res.json({forumId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

/* ChatGPT usage: No */
export async function removeForum(req, res) {
    const forumModel = new Forum();
    try {
        const result = await forumModel.deleteForum(req.userId, req.params.forumId);
        return result ? res.json({message: "deleted forum"}) : res.status(403).json({message: "not authorized to delete forum"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

/* ChatGPT usage: No */
export async function getUsersForums(req, res) {
    const userForumsModel = new UserForums();
    try {
        const forums = await userForumsModel.getUsersForums(req.userId);
        return res.json(forums);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

/* ChatGPT usage: No */
export async function addUsersForum(req, res) {
    const userForumsModel = new UserForums();
    try {
        await userForumsModel.addUserForum(req.userId, req.body.forumId);
        return res.json({message:"added user to forum"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function removeUsersForum(req, res) {
    const userForumsModel = new UserForums();
    try {
        await userForumsModel.removeUserForum(req.userId, req.params.forumId);
        return res.json({message: "removed user from forum"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}