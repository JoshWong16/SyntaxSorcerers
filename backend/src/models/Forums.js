import { database } from '../db/db.js';

class Forums {
    constructor() {
        this.collection = database.collection("forums");
    }

    async getAllForums() {
        // TODO: Implement
    }

    async getUsersForums(userId) {
        // TODO: Implement
    }
    
    async deleteForum(userId) {
        // TODO: Implement
    }
}

export default Forums;