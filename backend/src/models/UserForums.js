import { database } from '../db/db.js';

class UserForums {
    constructor() {
        this.collection = database.collection("userForums");
    }

    async getUsersForums(userId) {
        // TODO: Implement
    }

    async addUserForum(userId, forumId) {
        // TODO: Implement
    }

    async removeUserForum(userId, forumId) {
        // TODO: Implement
    }
}

export default UserForums;