import { database } from '../db/db.js';
import Forums from './Forums.js';

class UserForums {
    constructor() {
        this.collection = database.collection("userForums");
    }

    async getUsersForums(userId) {
        const forums = await this.collection.find({ userId }).toArray();
        const forumIds = forums.map(forum => forum.forumId);
        const model = new Forums();
        const userForums = await model.getForumsByIds(forumIds);
        return userForums.map(forum => {
            return {
                forumId: forum._id.toString(),
                name: forum.name,
                createdBy: forum.createdBy,
                dateCreated: forum.dateCreated,
                course: forum.course
            };
        });;
    }

    async addUserForum(userId, forumId) {
        await this.collection.insertOne({ userId, forumId });
    }

    async removeUserForum(userId, forumId) {
        await this.collection.deleteOne({ userId, forumId });
    }
}

export default UserForums;