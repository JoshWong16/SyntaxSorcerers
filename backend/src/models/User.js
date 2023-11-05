import { database } from '../db/db.js';

class User {
    constructor() {
        this.collection = database.collection("users");
    }

    /* ChatGPT usage: No */
    async getUser(id) {
        const user = await this.collection.findOne({ userId: id });
        return user;
    }

    /* ChatGPT usage: No */
    async createUser(user) {
        const result = await this.collection.insertOne(user);
        return result.insertedId;
    }

    /* ChatGPT usage: No */
    async updateUser(userId, updateData) {
        const result = await this.collection.updateOne(
            { userId: userId },
            { $set: updateData }
        );
        return result.matchedCount > 0;
    }

    /* ChatGPT usage: No */
    async deleteUser(userId) {
        const result = await this.collection.deleteOne({ userId : userId });
        return result.deletedCount > 0;
    }
}

export default User;