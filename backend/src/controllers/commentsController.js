import Comments from '../models/Comments.js';

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

async function addComment(req, res) {
    const model = new Comments();
    try {
        const commentId = await model.addComment(req.body.content, req.body.postId, req.userId);
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