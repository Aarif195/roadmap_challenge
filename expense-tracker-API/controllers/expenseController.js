const { ObjectId } = require("mongodb");
const { getCollection } = require("../db");


// Create a new expense
async function createExpense(req, res) {
    try {
        const { title, amount, category, date } = req.body;
        if (!title || !amount || !category)
            return res.status(400).json({ message: "Title, amount, and category are required" });

        const collection = getCollection("expenses");
        const expense = {
            userId: new ObjectId(req.user.userId),
            title,
            amount,
            category,
            date: date ? new Date(date) : new Date(),
            createdAt: new Date()
        };

        const result = await collection.insertOne(expense);
        res.status(201).json({ _id: result.insertedId, ...expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all expenses (with date filters)
async function getExpenses(req, res) {
    try {
        const { filter, start, end } = req.query;
        const collection = getCollection("expenses");
        const now = new Date();

        let query = { userId: new ObjectId(req.user.userId) };
        let fromDate;

        // 1. Determine the start date based on filter
        if (filter === "week") {
            fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        } else if (filter === "month") {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        } else if (filter === "3month") {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        }

        // 2. Build the date query
        if (start && end) {
            // Custom range takes priority
            query.date = { $gte: new Date(start), $lte: new Date(end) };
        } else if (fromDate) {
            // Preset filter applies
            query.date = { $gte: fromDate };
        }

        console.log("Final MongoDB Query:", JSON.stringify(query, null, 2));

        const expenses = await collection.find(query).sort({ date: -1 }).toArray();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update an expense
async function updateExpense(req, res) {
    console.log("JWT User Data:", req.user);
    try {
        const { title, amount, category, date } = req.body;
        if (!title && !amount && !category && !date)
            return res.status(400).json({ message: "Nothing to update" });

        const collection = getCollection("expenses");

        console.log({
            _id: new ObjectId(req.params.id),
            userId: new ObjectId(req.user.userId)
        });

        const result = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(req.params.id),
                $or: [
                    { userId: req.user.userId },
                    { userId: new ObjectId(req.user.userId) }
                ]
            },
            {
                $set: {
                    ...(title && { title }),
                    ...(amount && { amount }),
                    ...(category && { category }),
                    ...(date && { date: new Date(date) })
                }
            },
            { returnDocument: "after" }
        );

        if (!result) return res.status(404).json({ message: "Expense not found" });

        res.status(200).json({ message: "Expense updated", expense: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// delete
async function deleteExpense(req, res) {
    try {
        const collection = getCollection("expenses");

        const result = await collection.findOneAndDelete({
            _id: new ObjectId(req.params.id),
            $or: [
                { userId: req.user.userId },
                { userId: new ObjectId(req.user.userId) }
            ]
        });

        if (!result) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };
