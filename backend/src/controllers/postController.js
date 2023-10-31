import Posts from "../models/Posts.js";

/* ChatGPT usage: No */
async function getAllPosts(req, res) {
    const model = new Posts();
    try {
        const posts = req.query.category ? await model.getFilteredPosts(req.params.forumId, req.query.category, req.userId) : await model.getAllPost(req.params.forumId, req.userId);
        return res.json(posts);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function getPostById(req, res) {
    const model = new Posts();
    try {
        const post = await model.getPostById(req.userId, req.params.postId);
        return res.json(post);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function addPost(req, res) {
    const model = new Posts();
    try {
        const postId = await model.addPost(req.body.content, req.userId, req.body.forumId);
        return res.json({postId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function deletePost(req, res) {
    const model = new Posts();
    try {
        const result = await model.deletePost(req.params.postId, req.userId);
        return result ? res.json({message: "deleted post"}) : res.status(403).json({message: "not authorized to delete post"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
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