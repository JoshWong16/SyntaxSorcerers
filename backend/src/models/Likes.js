import { database } from '../db/db.js';

class Likes {
    constructor() {
        this.collection = database.collection("likes");
    }

    async getAllLikes(postId) {
        // TODO: Implement
    }

    async addLike(postId, userId) {
        // TODO: Implement
    }
    
    async removeLike(postId, userId) {
        // TODO: Implement
    }
}

export default Likes;