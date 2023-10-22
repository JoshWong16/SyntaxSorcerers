async function createDatabase() {
    try {
        const client = await new MongoClient("mongodb://127.0.0.1:27017/");
        await client.connect();
        const database = await client.db("cpen321");
         
        await database.createCollection("users");
        await database.createCollection("forums");
        await database.createCollection("posts");
        await database.createCollection("comments");
        await database.createCollection("likes");
        await database.createCollection("userForums");
        await database.createCollection("userCourses");
    
        console.log("Database and Collections created!");
        client.close();
    } catch (e) {
        console.error(e);
    }
}

await createDatabase();
