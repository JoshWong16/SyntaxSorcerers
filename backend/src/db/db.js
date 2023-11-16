/* ChatGPT usage: No */
import { MongoClient } from 'mongodb';

const url = "mongodb://127.0.0.1:27017/";
let database = null;

async function connectToDatabase() {
    try {
        const client = await new MongoClient(url);
        database = await client.db("cpen321");
    } catch (e) {
        console.error(e);
    }
}

// Call the function to establish the database connection
connectToDatabase();

export { database };