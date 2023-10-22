import { database } from '../db/db.js';

class Posts {
    constructor() {
        this.collection = database.collection("posts");
    }

    async getPost(postId) {
        // TODO: Implement
    }

    async addPost(text, userId, courseId) {
        // TODO: Implement
    }

    async editPost(text, postId, userId) {
        // TODO: Implement
    }
    
    async deletePost(postId, userId) {
        // TODO: Implement
    }
}

export default Posts;