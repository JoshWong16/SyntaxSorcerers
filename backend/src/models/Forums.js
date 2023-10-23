import { database } from '../db/db.js';
import { ObjectId } from 'mongodb';

class Forums {
    constructor() {
        this.collection = database.collection("forums");
    }

    async getAllForums() {
        const forums = await this.collection.find({}).toArray();
        return forums.map(forum => {
            return {
                forumId: forum._id.toString(),
                name: forum.name,
                createdBy: forum.createdBy,
                dateCreated: forum.dateCreated,
                course: forum.course
            };
        });
    }

    async searchForums(searchTerm) {
        // TODO: Implement
        const forums = await this.collection.find({ $or: [ { name: {'$regex': searchTerm} }, { course: {'$regex': searchTerm} } ] }).toArray();
    }

    async addForum(data) {
        await this.collection.insertOne(data);
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