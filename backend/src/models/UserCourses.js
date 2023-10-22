import { database } from '../db/db.js';

class UserCourses {
    constructor() {
        this.collection = database.collection("userCourses");
    }

    async getUserCourses(userId) {
        // TODO: Implement
    }

    async addUserCourse(userId, courseId) {
        // TODO: Implement
    }

    async removeUserCourse(userId, courseId) {
        // TODO: Implement
    }
}

export default UserCourses;