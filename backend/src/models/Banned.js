import { database } from '../db/db.js';
import User from './User.js';

class Banned {
    constructor() {
        this.collection = database.collection("banned");
    }

    /* ChatGPT usage: No */
    async getAllBannedUsers() {
        const result = await this.collection.find({}).toArray();
        const user = new User();
        const bannedUsers = [];
        for (let res of result) {
            bannedUsers.push(await user.getUser(res.userId));
        }
        return bannedUsers;
    }

    /* ChatGPT usage: No */
    async getBannedUser(userId) {
        const result = await this.collection.find({ userId : userId}).toArray();
        return result.length > 0;
    }

    /* ChatGPT usage: No */
    async addBannedUser(userId) {
        const result = await this.collection.insertOne({userId: userId});
        return result.insertedId;
    }
}

export default Banned;