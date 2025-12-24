const express = require("express");
const router = express.Router();
const { getTodosCollection } = require("../db");
const authenticateToken = require("../middleware");
const { ObjectId } = require("mongodb");

// 1. Create a To-Do item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = {
      userId: new ObjectId(req.user.userId),
      title,
      description: description || "",
      completed: true,
      createdAt: new Date()
    };

    const collection = getTodosCollection();
    const result = await collection.insertOne(todo);
    res.status(201).json({ message: "To-Do created", todo: { _id: result.insertedId, ...todo } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get all To-Do items for the user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const collection = getTodosCollection();
    const todos = await collection.find({ userId: new ObjectId(req.user.userId) }).toArray();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get a single To-Do item
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const collection = getTodosCollection();
    const todo = await collection.findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.userId)
    });
    if (!todo) return res.status(404).json({ message: "To-Do not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//4 Update To-Do
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    if (!title && !description && completed === undefined) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const collection = getTodosCollection();
    const result = await collection.findOneAndUpdate(
      
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user.userId) },
      { $set: { 
          ...(title && { title }),
          ...(description && { description }),
          ...(completed !== undefined && { completed })
        } 
      },
      { returnDocument: "after" }
    );

    const query = { 
  _id: new ObjectId(req.params.id), 
  userId: new ObjectId(req.user.userId) 
};
console.log("MongoDB query:", query);


    if (!result.value) return res.status(404).json({ message: "To-Do not found" });

    res.status(200).json({ message: "To-Do updated", todo: result.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete To-Do
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const collection = getTodosCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "To-Do not found" });
    }

    res.status(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Toggle To-Do complete
router.patch("/:id/toggle", authenticateToken, async (req, res) => {
  try {
    const collection = getTodosCollection();

    const todo = await collection.findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.userId)
    });

    if (!todo) return res.status(404).json({ message: "To-Do not found" });

    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user.userId) },
      { $set: { completed: !todo.completed } },
      { returnDocument: "after" }
    );

    res.status(200).json({ message: "To-Do updated", todo: updated.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
