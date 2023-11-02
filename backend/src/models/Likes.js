import { database } from '../db/db.js';

class Likes {
    constructor() {
        this.collection = database.collection("likes");
    }

    /* ChatGPT usage: No */
    async getAllLikes(postId) {
        const likes = this.collection.find({ postId: postId }).toArray();
        return likes;
    }

    /* ChatGPT usage: No */
    async userLikedPost(postId, userId) {
        const like = await this.collection.findOne({ postId: postId, userId: userId });
        return like !== null;
    }

    /* ChatGPT usage: No */
    async addLike(postId, userId) {
        const like = {
            postId: postId,
            userId: userId
        };
        const result = await this.collection.insertOne(like);
        return result.insertedId;
    }
    
    /* ChatGPT usage: No */
    async removeLike(postId, userId) {
        const result = await this.collection.deleteOne({ postId: postId, userId: userId });
        return result.deletedCount > 0;
    }
}

export default Likes;