import express from "express";
import { ObjectId } from "mongodb";

import bodyParser from "body-parser";
import { connectToMongo, getPostsCollection } from "./db.js";

const app = express();
app.use(bodyParser.json());

connectToMongo();

// 1. Create a new post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category)
      return res.status(400).json({ error: "All fields are required" });

    const post = { title, content, category, createdAt: new Date() };
    const collection = getPostsCollection();
    const result = await collection.insertOne(post);

    // Send the created post back, including the generated _id
    res.status(201).json({ _id: result.insertedId, ...post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Update a post
app.put("/posts/:id", async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const collection = getPostsCollection();
        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { title, content, category } },
            { returnDocument: "after" }
        );
        if (!result.value) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({
            message: "Post updated successfully",
            post: result.value
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete a post
app.delete("/posts/:id", async (req, res) => {
    try {
        const collection = getPostsCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Post not found" });
        res.status(204).send();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

// 4. get single post
app.get("/posts/:id", async (req, res) => {
  try {
    const collection = getPostsCollection();
    const post = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. get all post
app.get("/posts", async (req, res) => {
  try {
    const collection = getPostsCollection();
    const posts = await collection.find({}).toArray();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. filter by search
app.get("/posts/search/:term", async (req, res) => {
  try {
    const { term } = req.params;
    const collection = getPostsCollection();
    const regex = new RegExp(term, "i"); 
    const posts = await collection
      .find({
        $or: [
          { title: regex },
          { content: regex },
          { category: regex }
        ]
      })
      .toArray();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
