const command = process.argv[2];
const input = process.argv[3];

console.log("Command:", command);
// Command: add
console.log("Input:", input);
// Input: Buy groceries
console.log(process.argv);
// [ 'node', 'task.js', 'add', 'Buy groceries' ]

// node task.js add "Learn Node.js"

//  node task.js list
// 1. Learn Node.js [todo] (created: 2025-10-18T09:25:36.130Z)
 
//  node task.js update 1 "Learn Node.js deeply"
// Task 1 updated successfully.

// node task.js delete 6

// node task.js mark-in-progress 2 

// node task.js mark-done 5

// node task.js list done
// node task.js list todo
// node task.js list in-progress


// 2 activity  kamranahmedse

// 3 EXPENSE TRACKER
//  expense add --description "Lunch" --amount 20
//  expense add --description "Groceries" --amount 50 --category "Food"
// expense list
// expense delete 1
//  expense.js update 2 --description "Snacks" --amount 15
// expense filter --description snacks
// expense filter --date 2025-10-21
// expense filter --description lunch --date 2025-10-21
// expense summary
// expense summary --month 10


// 4 number-guessing-game
// node game.js
