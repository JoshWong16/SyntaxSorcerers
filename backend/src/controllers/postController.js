import Posts from "../models/Posts.js";

async function getAllPosts(req, res) {
    const model = new Posts();
    try {
        const posts = req.query.category ? await model.getFilteredPosts(req.query.forumId, req.query.category) : await model.getAllPost(req.params.forumId);
        return res.json(posts);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function getPostById(req, res) {
    const model = new Posts();
    try {
        const post = await model.getPostById(req.params.postId);
        return res.json(post);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function addPost(req, res) {
    const model = new Posts();
    try {
        const postId = await model.addPost(req.body.content, req.userId, req.body.forumId);
        return res.json({postId});
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function deletePost(req, res) {
    const model = new Posts();
    try {
        const result = await model.deletePost(req.params.postId, req.userId);
        return result ? res.send("deleted post") : res.status(403).send("not authorized to delete post");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function editPost(req, res) {
    const model = new Posts();
    try {
        const result = await model.editPost(req.body.content, req.params.postId, req.userId);
        return result ? res.send("post edited") : res.status(403).send("not authorized to edit post");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { getAllPosts, getPostById, addPost, deletePost, editPost }