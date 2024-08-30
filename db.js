const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db("cicdperarddklynov"); // Assurez-vous que le nom de la base est correct
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        throw err;
    }
}

module.exports = connectDB;