import { database } from '../db/db.js';
import { ObjectId } from 'mongodb';
import manipulatePostOutput from '../helpers/manipulatePostOutput.js';

class Posts {
    constructor() {
        this.collection = database.collection("posts");
    }

    async getAllPost(forumId) {
        const posts = await this.collection.find({forumId: forumId}).toArray();
        return manipulatePostOutput(posts);
    }

    async getPostById(postId) {
        const post = await this.collection.findOne(new ObjectId(postId));
        return manipulatePostOutput([post])[0];
    }

    async addPost(content, userId, forumId) {
        const result = await this.collection.insertOne({ writtenBy: userId, forumId: forumId, dateWritten: new Date(), content: content });
        return result.insertedId.toString();
    }

    async editPost(content, postId, userId) {
        const result = await this.collection.updateOne(
            { userId: userId, _id: new ObjectId(postId) },
            { $set: { content, dateWritten: new Date() } }
        );
        return result.matchedCount > 0;
    }
    
    async deletePost(postId, userId) {
        try {
            const result = await this.collection.deleteOne({ _id : new ObjectId(postId), writtenBy: userId });
            return result.deletedCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default Posts;