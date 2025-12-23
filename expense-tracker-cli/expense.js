#!/usr/bin/env node

const fs = require("fs");
const file = "expenses.json";

// Create file if it doesn't exist
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "[]");
}

// Read expenses
const readExpenses = () => {
  const data = fs.readFileSync(file, "utf8");
  return JSON.parse(data);
};

// Save expenses
const saveExpenses = (expenses) => {
  fs.writeFileSync(file, JSON.stringify(expenses, null, 2));
};

const command = process.argv[2];
const descriptionIndex = process.argv.indexOf("--description");
const amountIndex = process.argv.indexOf("--amount");

const description =
  descriptionIndex !== -1 ? process.argv[descriptionIndex + 1] : null;
const amount =
  amountIndex !== -1 ? parseFloat(process.argv[amountIndex + 1]) : null;

// 1 Adding expenses
if (command === "add") {
  if (!description || isNaN(amount) || amount <= 0) {
    console.log("Please provide a valid description and a positive amount.");
    process.exit(1);
  }

  const expenses = readExpenses();
  const nextId =
    expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;

  const newExpense = {
    id: nextId,
    description,
    amount,
    date: new Date().toISOString(),
  };

  expenses.push(newExpense);
  saveExpenses(expenses);

  console.log(`Expense added successfully (ID: ${newExpense.id})`);
}

//2 Listing Expenses
if (command === "list") {
  const expenses = readExpenses();
  if (expenses.length === 0) {
    console.log("No expenses found.");
    process.exit(0);
  }
  console.log("ID  Date       Description  Amount");
  expenses.forEach((exp) => {
    console.log(
      `${exp.id}   ${exp.date.split("T")[0]}  ${exp.description}  $${
        exp.amount
      }`
    );
  });
}

//3 Deleting Expenses
if (command === "delete") {
  const id = parseInt(process.argv[3]);
  const expenses = readExpenses();
  const index = expenses.findIndex((exp) => exp.id === id);

  if (index === -1) {
    console.log(`Expense with ID ${id} not found.`);
    process.exit(1);
  }

  expenses.splice(index, 1);
  saveExpenses(expenses);
  console.log(`Expense ${id} deleted successfully.`);
}

// Update Expenses

// 4 UPDATE expense
if (command === "update") {
  const id = parseInt(process.argv[3], 10);

  if (isNaN(id)) {
    console.log("Please provide a valid expense ID to update.");
    process.exit(1);
  }

  // description && amount
  const descIndex = process.argv.indexOf("--description");
  const amtIndex = process.argv.indexOf("--amount");

  const expenses = readExpenses();
  const expense = expenses.find((exp) => exp.id === id);

  if (!expense) {
    console.log("Expense not found.");
    process.exit(1);
  }

  // If --description was provided, its value is the next argv item
  if (descIndex !== -1) {
    const newDescription = process.argv[descIndex + 1];
    if (!newDescription) {
      console.log("Please provide a description after --description.");
      process.exit(1);
    }
    expense.description = newDescription;
    expense.updatedAt = new Date().toISOString();
  }

  if (amtIndex !== -1) {
    const newAmount = parseFloat(process.argv[amtIndex + 1]);
    if (isNaN(newAmount) || newAmount <= 0) {
      console.log("Please provide a valid positive number after --amount.");
      process.exit(1);
    }
    expense.amount = newAmount;
    expense.updatedAt = new Date().toISOString();
  }

  // If neither flag was provided, warn user
  if (descIndex === -1 && amtIndex === -1) {
    console.log("Nothing to update. Use --description and/or --amount.");
    process.exit(1);
  }

  saveExpenses(expenses);
  console.log(`Expense updated successfully (ID: ${id})`);
}

//5) Filter or search expenses by description or date.
else if (command === "filter") {
  const descIndex = process.argv.indexOf("--description");
  const dateIndex = process.argv.indexOf("--date");

  let expenses = readExpenses();
  let filtered = expenses;

  // Filter by description keyword
  if (descIndex !== -1) {
    const keyword = process.argv[descIndex + 1];
    if (!keyword) {
      console.log("Please provide a keyword after --description");
      process.exit(1);
    }
    filtered = filtered.filter((exp) =>
      exp.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Filter by date (YYYY-MM-DD)
  if (dateIndex !== -1) {
    const dateValue = process.argv[dateIndex + 1];
    if (!dateValue) {
      console.log("Please provide a date after --date");
      process.exit(1);
    }

    filtered = filtered.filter(
      (exp) => exp.date && exp.date.startsWith(dateValue)
    );
  }

  if (filtered.length === 0) {
    console.log("No matching expenses found.");
  } else {
    console.log("Filtered expenses:");
    console.log(filtered);
  }
}

// 6) SUMMARY  EXPENSES
if (command === "summary") {
  const expenses = readExpenses();

  if (expenses.length === 0) {
    console.log("No expenses found.");
    process.exit(0);
  }

  // Add up all the amounts
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  console.log(`Total expenses: $${total}`);
}

// SUMMARY FOR SPECIFIC MONTH
if (command === "summary" && process.argv.includes("--month")) {
  const monthIndex = process.argv.indexOf("--month");
  const monthValue = parseInt(process.argv[monthIndex + 1]);

  if (isNaN(monthValue) || monthValue < 1 || monthValue > 12) {
    console.log("Please provide a valid month number (1–12).");
    process.exit(1);
  }

  const currentYear = new Date().getFullYear();
  const expenses = readExpenses();

  const monthlyExpenses = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return (
      date.getMonth() + 1 === monthValue && date.getFullYear() === currentYear
    );
  });

  const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  console.log(`Total expenses for month ${monthValue}: $${total}`);
}
