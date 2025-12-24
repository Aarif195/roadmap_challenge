const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db;
let usersCollection;
let todosCollection;

async function connectToMongo() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  usersCollection = db.collection("users-api");
  todosCollection = db.collection("todos-api");
  console.log("MongoDB connected:", dbName);
}

function getUsersCollection() {
  if (!usersCollection) throw new Error("Database not connected. Call connectToMongo() first.");
  return usersCollection;
}

function getTodosCollection() {
  if (!todosCollection) throw new Error("Database not connected. Call connectToMongo() first.");
  return todosCollection;
}

module.exports = {
  connectToMongo,
  getUsersCollection,
  getTodosCollection
};
