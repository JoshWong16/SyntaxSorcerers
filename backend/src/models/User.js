import { database } from '../db/db.js';

class User {
    constructor() {
        this.collection = database.collection("users");
    }

    async getUser(id) {
        try {
            const user = await this.collection.findOne({ userId: id });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async createUser(user) {
        try {
            const result = await this.collection.insertOne(user);
            return result.insertedId;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            const result = await this.collection.updateOne(
                { userId: userId },
                { $set: updateData }
            );
            return result.matchedCount > 0;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const result = await this.collection.deleteOne({ userId : userId });
            return result.deletedCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default User;