import { MongoClient } from "mongodb";

/* ChatGPT usage: No */
async function createDatabase() {
    try {
        const client = await new MongoClient("mongodb://127.0.0.1:27017/");
        await client.connect();

        // create database
        const database = await client.db("cpen321");
         
        // create collections
        await database.createCollection("users");
        await database.createCollection("forums");
        await database.createCollection("posts");
        await database.createCollection("comments");
        await database.createCollection("likes");
        await database.createCollection("userForums");
        await database.createCollection("userCourses");
        await database.createCollection("userInterests");

        // insert sample user
        const users = database.collection("users");
        
        await users.insertOne({
            userId: "1",
            email: "bobbyjoe@gmail.com",
            year_level: "1",
            major: "Computer Engineering",
            name: "Bobby Joe",
        });

        await users.insertOne({
            userId: "2",
            email: "johnsmith@gmail.com",
            year_level: "4",
            major: "LFS",
            name: "John Smith",
        });

        await users.insertOne({
            userId: "3",
            email: "test@gmail.com",
            year_level: "5",
            major: "MATH",
            name: "Billy Bob",
        });

        // insert sample forums
        const forums = database.collection("forums");

        const forum1 = await forums.insertOne({
            name: "CPEN 321 Forum",
            createdBy: "1",
            createdAt: new Date(),
            course: "CPEN 321",
        });

        const forum2 = await forums.insertOne({
            name: "CPEN 311 Forum",
            createdBy: "2",
            createdAt: new Date(),
            course: "CPEN 311",
        });

        const forum3 = await forums.insertOne({
            name: "Math 100 Forum",
            createdBy: "2",
            createdAt: new Date(),
            course: "MATH 100",
        });

        // insert sample posts
        const posts = database.collection("posts");

        const post1 = await posts.insertOne({
            forumId: forum1.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I am having trouble with the assignment. Can someone help me?",
            category: "neutral",
        });

        const post2 = await posts.insertOne({
            forumId: forum1.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "this is my favourite course",
            category: "positive",
        });

        const post3 = await posts.insertOne({
            forumId: forum2.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "This course was so challenging",
            category: "neutral",
        });

        const post4 = await posts.insertOne({
            forumId: forum2.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "I hate this course",
            category: "negative",
        });

        const post5 = await posts.insertOne({
            forumId: forum3.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "The professor is terrible for this class",
            category: "negative",
        });

        const post6 = await posts.insertOne({
            forumId: forum1.insertedId.toString(),
            writtenBy: "3",
            dateWritten: new Date(),
            content: "The professor is awesome for this class",
            category: "positive",
        });

        const post7 = await posts.insertOne({
            forumId: forum3.insertedId.toString(),
            writtenBy: "3",
            dateWritten: new Date(),
            content: "What is everyones opinion about the midterm?",
            category: "neutral",
        });

        const post8 = await posts.insertOne({
            forumId: forum3.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I am so not ready for this final",
            category: "neutral",
        });

        const post9 = await posts.insertOne({
            forumId: forum2.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "I definitely failed the final :(, I hate the prof for making it so hard",
            category: "negative",
        });

        const post10 = await posts.insertOne({
            forumId: forum2.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "The midterm was so fair",
            category: "positive",
        });

        // insert sample comments
        const comments = database.collection("comments");

        await comments.insertOne({
            postId: post1.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "I can help you",
        });

        await comments.insertOne({
            postId: post1.insertedId.toString(),
            writtenBy: "3",
            dateWritten: new Date(),
            content: "I can help you too",
        });

        await comments.insertOne({
            postId: post2.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I agree",
        });

        await comments.insertOne({
            postId: post3.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I agree",
        });

        await comments.insertOne({
            postId: post3.insertedId.toString(),
            writtenBy: "3",
            dateWritten: new Date(),
            content: "I disagree",
        });

        await comments.insertOne({
            postId: post4.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I agree",
        });

        await comments.insertOne({
            postId: post5.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I agree",
        });

        await comments.insertOne({
            postId: post6.insertedId.toString(),
            writtenBy: "2",
            dateWritten: new Date(),
            content: "I agree",
        });

        await comments.insertOne({
            postId: post6.insertedId.toString(),
            writtenBy: "1",
            dateWritten: new Date(),
            content: "I agree too",
        });

        // insert sample likes
        const likes = database.collection("likes");

        await likes.insertOne({
            postId: post1.insertedId.toString(),
            userId: "2",
        });

        await likes.insertOne({
            postId: post1.insertedId.toString(),
            userId: "3",
        });

        await likes.insertOne({
            postId: post2.insertedId.toString(),
            userId: "1",
        });

        await likes.insertOne({
            postId: post3.insertedId.toString(),
            userId: "1",
        });

        await likes.insertOne({
            postId: post3.insertedId.toString(),
            userId: "3",
        });

        await likes.insertOne({
            postId: post6.insertedId.toString(),
            userId: "1",
        });

        await likes.insertOne({
            postId: post6.insertedId.toString(),
            userId: "2",
        });

        await likes.insertOne({
            postId: post7.insertedId.toString(),
            userId: "3",
        });

        await likes.insertOne({
            postId: post8.insertedId.toString(),
            userId: "1",
        });

        await likes.insertOne({
            postId: post9.insertedId.toString(),
            userId: "2",
        });

        await likes.insertOne({
            postId: post10.insertedId.toString(),
            userId: "1",
        });

        console.log("Database and Collections created!");

        client.close();
    } catch (e) {
        console.error(e);
    }
}

await createDatabase();
