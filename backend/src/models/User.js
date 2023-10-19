import { database } from '../db/db.js';

class User {
    constructor() {
        this.collection = database.collection("users");
    }

    async getUser(id) {
        // TODO: Implement
    }

    async createUser(user) {
        // TODO: Implement
    }

    async updateUser(userId, updateData) {
        // TODO: Implement
    }
    
    async deleteUser(userId) {
        // TODO: Implement
    }
}

export default User;