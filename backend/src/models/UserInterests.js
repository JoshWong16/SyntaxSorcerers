import { database } from '../db/db.js';

class UserInterests {
    constructor() {
        this.collection = database.collection("userInterests");
    }

    /* ChatGPT usage: No */
    async getUserInterests(userId) {
        const response = await this.collection.find({userId: userId}).toArray();
        return response.map(interest => {
            return interest.interest
        });
    }

    /* ChatGPT usage: No */
    async addUserInterest(userId, interest) {
        const doc = { userId: userId, interest: interest }
        await this.collection.updateOne(doc, { $set: doc }, {upsert:true});
    }

    /* ChatGPT usage: No */
    async removeUserInterest(userId, interest) {
        await this.collection.deleteOne({userId: userId, interest: interest});
    }
}

export default UserInterests;