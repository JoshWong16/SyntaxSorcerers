import { database } from '../db/db.js';
import manipulateCommentOutput from '../helpers/manipulateCommentOutput.js';

class Comments {
    constructor() {
        this.collection = database.collection("comments");
    }

    async getAllComments(postId) {
        const comments = await this.collection.find({ postId: postId }).toArray();
        return manipulateCommentOutput(comments);
    }

    async addComment(content, postId, userId) {
        const comment = {
            content: content,
            writtenBy: userId,
            postId: postId,
            dateWritten: new Date()
        };
        const result = await this.collection.insertOne(comment);
        return result.insertedId;
    }

    async editComment(content, commentId, userId) {
        const result = await this.collection.updateOne(
            { userId: userId, _id: new ObjectId(commentId) },
            { $set: { content, dateWritten: new Date() } }
        );
        return result.matchedCount > 0;
    }
    
    async deleteComment(commentId, userId) {
        try {
            const result = await this.collection.deleteOne({ _id : new ObjectId(commentId), writtenBy: userId });
            return result.deletedCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default Comments;