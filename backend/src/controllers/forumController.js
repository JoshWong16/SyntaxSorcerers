import Forum from '../models/Forums.js';
import UserForums from '../models/UserForums.js';

async function getAllForums(req, res) {
    const forumModel = new Forum();
    try {
        const forums = req.query.search ? await forumModel.searchForums(req.query.search) : await forumModel.getAllForums();
        return res.json(forums);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

async function addForum(req, res) {
    const forumModel = new Forum();
    try {
        await forumModel.addForum(req.body);
        return res.send("created new forum");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

async function removeForum(req, res) {
    const forumModel = new Forum();
    try {
        const result = await forumModel.deleteForum(req.userId, req.params.forumId);
        if (result) {
            return res.send("deleted forum");
        } else {
            return res.status(403).send("not authorized to delete forum");
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

async function getUsersForums(req, res) {
    const userForumsModel = new UserForums();
    try {
        const forums = await userForumsModel.getUsersForums(req.userId);
        return res.json(forums);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

async function addUsersForum(req, res) {
    const userForumsModel = new UserForums();
    try {
        await userForumsModel.addUserForum(req.userId, req.body.forumId);
        return res.send("added user to forum");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function removeUsersForum(req, res) {
    const userForumsModel = new UserForums();
    try {
        await userForumsModel.removeUserForum(req.userId, req.body.forumId);
        return res.send("removed user from forum");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { getAllForums, addForum, removeForum, getUsersForums, addUsersForum, removeUsersForum };