import { database } from '../db/db.js';
import { ObjectId } from 'mongodb';
import manipulateForumOutput from '../helpers/manipulateForumOuput.js';

class Forums {
    constructor() {
        this.collection = database.collection("forums");
    }

    async getAllForums() {
        const forums = await this.collection.find({}).toArray();
        return manipulateForumOutput(forums);
    }

    async searchForums(searchTerm) {
        const forums = await this.collection.find({ $or: [ { name: {'$regex': searchTerm} }, { course: {'$regex': searchTerm} } ] }).toArray();
        return manipulateForumOutput(forums);
    }

    async addForum(name, userId, course) {
        const result = await this.collection.insertOne({ name: name, createdBy: userId, course: course, dateCreated: new Date() });
        return result.insertedId.toString();
    };
    
    async deleteForum(userId, forumId) {
        try {
            const result = await this.collection.deleteOne({ createdBy : userId, forumId: forumId });
            return result.deletedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    async getForumsByIds(forumIds) {
        const result = [];
        for (const forumId of forumIds) {
            const forum = await this.collection.findOne(new ObjectId(forumId));
            result.push(forum);
        }
        return result;
    }
}

export default Forums;