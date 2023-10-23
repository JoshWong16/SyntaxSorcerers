import { database } from '../db/db.js';

class UserCourses {
    constructor() {
        this.collection = database.collection("userCourses");
    }

    async getUserCourses(userId) {
        const response = await this.collection.find({userId: userId}).toArray();
        return response.map(course => {
            return course.courseId
        });
    }

    async addUserCourse(userId, courseId) {
        const doc = { userId: userId, courseId: courseId }
        await this.collection.updateOne(doc, { $set: doc }, {upsert:true});
    }

    async removeUserCourse(userId, courseId) {
        await this.collection.deleteOne({userId: userId, courseId: courseId});
    }
}

export default UserCourses;