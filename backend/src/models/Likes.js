import { database } from '../db/db.js';

class Likes {
    constructor() {
        this.collection = database.collection("likes");
    }

    async getAllLikes(postId) {
        const likes = this.collection.find({ postId: postId }).toArray();
        return likes;
    }

    async userLikedPost(postId, userId) {
        const like = await this.collection.findOne({ postId: postId, userId: userId });
        return like !== null;
    }

    async addLike(postId, userId) {
        const like = {
            postId: postId,
            userId: userId
        };
        const result = await this.collection.insertOne(like);
        return result.insertedId;
    }
    
    async removeLike(postId, userId) {
        try {
            const result = await this.collection.deleteOne({ postId: postId, userId: userId });
            return result.deletedCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default Likes;