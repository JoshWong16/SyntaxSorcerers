import { database } from '../db/db.js';

class Comments {
    constructor() {
        this.collection = database.collection("comments");
    }

    async getAllComments(postId) {
        // TODO: Implement
    }

    async addComment(text, userId, postId) {
        // TODO: Implement
    }

    async editComment(text, userId, commentId) {
        // TODO: Implement
    }
    
    async deleteComment(commentId, userId) {
        // TODO: Implement
    }
}

export default Comments;