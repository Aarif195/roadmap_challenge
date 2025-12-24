const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

router.post("/", authenticateToken, createExpense);
router.get("/", authenticateToken, getExpenses);
router.put("/:id", authenticateToken, updateExpense);
router.delete("/:id", authenticateToken, deleteExpense);

module.exports = router;
