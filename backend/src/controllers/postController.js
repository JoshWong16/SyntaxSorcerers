import Posts from "../models/Posts.js";

async function getAllPosts(req, res) {
    const model = new Posts();
    try {
        const posts = await model.getAllPost(req.params.forumId);
        return res.json(posts);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function getPostById(req, res) {
    const model = new Posts();
    try {
        const post = await model.getPostById(req.params.postId);
        return res.json(post);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function addPost(req, res) {
    const model = new Posts();
    try {
        const postId = await model.addPost(req.body.content, req.userId, req.body.forumId);
        return res.json({postId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function deletePost(req, res) {
    const model = new Posts();
    try {
        const result = await model.deletePost(req.params.postId, req.userId);
        return result ? res.json({message: "deleted post"}) : res.status(403).json({message: "not authorized to delete post"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function editPost(req, res) {
    const model = new Posts();
    try {
        const result = await model.editPost(req.body.content, req.params.postId, req.userId);
        return result ? res.json({message: "post edited"}) : res.status(403).json({message: "not authorized to edit post"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export { getAllPosts, getPostById, addPost, deletePost, editPost }