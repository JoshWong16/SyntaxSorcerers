import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URI
let database = null;

try {
    const client = await new MongoClient(url);
    database = await client.db("cpen321");
} catch (e) {
    console.error(e);
}

export { database };