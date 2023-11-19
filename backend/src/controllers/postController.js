import Posts from "../models/Posts.js";

/* ChatGPT usage: No */
export async function getAllPosts(req, res) {
    const model = new Posts();
    try {
        if ((req.query.category && !["positive", "negative", "neutral"].includes(req.query.category))) {
            return res.status(400).json({message: "invalid category"});
        }
        const posts = req.query.category ? await model.getFilteredPosts(req.params.forumId, req.query.category, req.userId) : await model.getAllPost(req.params.forumId, req.userId);
        return res.json(posts);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function getPostById(req, res) {
    const model = new Posts();
    try {
        const post = await model.getPostById(req.userId, req.params.postId);
        return res.json(post);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function addPost(req, res) {
    const model = new Posts();
    try {
        if (!req.body.content || !req.body.forumId) return res.status(400).json({message: "Invalid request, missing required fields"});
        const postId = await model.addPost(req.body.content, req.userId, req.body.forumId);
        return res.json({postId});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function deletePost(req, res) {
    const model = new Posts();
    try {
        const result = await model.deletePost(req.params.postId, req.userId);
        return result ? res.json({message: "deleted post"}) : res.status(403).json({message: "post does not exist"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
export async function editPost(req, res) {
    const model = new Posts();
    try {
        if (!req.body.content) return res.status(400).json({message: "Invalid request, missing required fields"});
        const result = await model.editPost(req.body.content, req.params.postId, req.userId);
        return result ? res.json({message: "post edited"}) : res.status(403).json({message: "post does not exist"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}