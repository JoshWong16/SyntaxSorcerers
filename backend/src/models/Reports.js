import { database } from '../db/db.js';
import Comments from './Comments.js';
import Posts from './Posts.js';
import User from './User.js'

class Reports {
    constructor() {
        this.collection = database.collection("reports");
    }

    async addReport(userId, commentId, postId) {
        const reported = {
            userId: userId,
            commentId: commentId,
            postId: postId
        }
        const result = await this.collection.insertOne(reported);
        return result.insertedId;
    }

    async getUserReports(userId) {
        const result = await await this.collection.find({ userId : userId }).toArray();
        const userContent = [];
        const comments = new Comments();
        const posts = new Posts();
        for (let res of result) {
            if(res.commentId) {
                userContent.push(await comments.getCommentById(res.commentId));
            } else if (res.postId) {
                userContent.push(await posts.getPostById(res.userId, res.postId));
            }
        }

        return userContent;
    }

    async getAllReports() {
        const reports = await this.collection.find({}).toArray();
        const userMap = {};
        const user = new User();
        for (let report of reports) {
            if (userMap[report.userId]) {
                userMap[report.userId].reportCount++;
            } else {
                userMap[report.userId] = {};
                userMap[report.userId].userInfo = await user.getUser(report.userId);
                userMap[report.userId].reportCount = 1;
            }
        }

        return userMap;
    }
}

export default Reports;