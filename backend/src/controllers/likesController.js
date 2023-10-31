import Likes from '../models/Likes.js';

/* ChatGPT usage: No */
async function getLikes(req, res) {
    const model = new Likes();
    try {
        const likes = await model.getAllLikes(req.params.post_id);
        res.json(likes);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function addLike(req, res) {
    const model = new Likes();
    try {
        const likeId = await model.addLike(req.body.post_id, req.userId);
        return res.json(likeId);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

/* ChatGPT usage: No */
async function removeLike(req, res) {
    const model = new Likes();
    try {
        const result = await model.removeLike(req.params.post_id, req.userId);
        return result ? res.json({message: "like removed"}) : res.status(403).json({message: "have not liked the message"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export { getLikes, addLike, removeLike }