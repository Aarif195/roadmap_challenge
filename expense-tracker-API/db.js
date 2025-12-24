const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db;

async function connectToMongo() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("MongoDB connected:", dbName);
}

function getCollection(name) {
  if (!db) throw new Error("Database not connected. Call connectToMongo() first.");
  return db.collection(name);
}

module.exports = { connectToMongo, getCollection };
