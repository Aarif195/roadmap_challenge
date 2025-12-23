#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const command = process.argv[2];
const input = process.argv[3];

// file path
const file = "tasks.json";

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "[]");
}

// read the current file content
console.log(path.resolve(file));
const data = fs.readFileSync(file, "utf8");
const tasks = JSON.parse(data);

const saveTasks = (tasks) => {
  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
};

  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;


// handle 'add' command
if (command === "add") {
  const newTask = {
    id: nextId,
    description: input,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  saveTasks(tasks);

  console.log(`Task added successfully (ID: ${newTask.id})`);
}

// 'list' command
// else if (command === "list") {
//   if (tasks.length === 0) {
//     console.log("No tasks found.");
//   } else {
//     console.log("Your Tasks:");
//     tasks.forEach((task) => {
//       console.log(
//         `${task.id}. ${task.description} [${task.status}] (created: ${task.createdAt})`
//       );
//     });
//   }
// }

else if (command === "list") {
  const filter = process.argv[3]; 

  let filteredTasks = tasks;

  if (filter) {
    filteredTasks = tasks.filter((t) => t.status === filter);
  }

  if (filteredTasks.length === 0) {
    console.log(filter ? `No ${filter} tasks found.` : "No tasks found.");
  } else {
    console.log(filter ? `Your ${filter} tasks:` : "Your Tasks:");
    filteredTasks.forEach((task) => {
      console.log(
        `${task.id}. ${task.description} [${task.status}] (created: ${task.createdAt})`
      );
    });
  }
}


// update command
else if (command === "update") {
  const id = parseInt(process.argv[3]);
  const newDescription = process.argv.slice(4).join(" ");

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.log(`Task with ID ${id} not found.`);
  } else {
    task.description = newDescription;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);
    console.log(`Task ${id} updated successfully.`);
  }
}
// delete command
else if (command === "delete") {
  const id = parseInt(process.argv[3]);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    console.log(`Task with ID ${id} not found.`);
  } else {
    tasks.splice(index, 1);
    saveTasks(tasks); 
    console.log(`Task ${id} deleted successfully.`);
  }
}

// mark a task as in-progress
else if (command === "mark-in-progress") {
  const id = parseInt(process.argv[3]);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.log(`Task with ID ${id} not found.`);
  } else {
    task.status = "in-progress";
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} marked as in-progress.`);
  }
}

// mark a task as done
else if (command === "mark-done") {
  const id = parseInt(process.argv[3]);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    console.log(`Task with ID ${id} not found.`);
  } else {
    task.status = "done";
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} marked as done.`);
  }
}
