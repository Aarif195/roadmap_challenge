#!/usr/bin/env node

const readline = require("readline");

// Create interface to read from terminal
const rl = readline.createInterface({
  input: process.stdin, ///// (keyboard)
  output: process.stdout, ///// (terminal)
});

function startGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("Please select the difficulty level:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");

  rl.question("Enter your choice: ", (choice) => {
    let maxAttempts;

    if (choice === "1") {
      maxAttempts = 10;
      console.log("Great! You have selected the Easy difficulty level.");
    } else if (choice === "2") {
      maxAttempts = 5;
      console.log("Great! You have selected the Medium difficulty level.");
    } else if (choice === "3") {
      maxAttempts = 3;
      console.log("Great! You have selected the Hard difficulty level.");
    } else {
      console.log(
        "Invalid choice. Please restart the game and enter 1, 2, or 3."
      );
      askPlayAgain();
      // rl.close();
      return;
    }

    console.log("Let's start the game!");

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    const askGuess = () => {
      if (attempts >= maxAttempts) {
        console.log(`Game over! The correct number was ${randomNumber}.`);
        rl.close();
        return;
      }

      rl.question("Enter your guess: ", (input) => {
        const guess = parseInt(input);
        attempts++;

        if (isNaN(guess) || guess < 1 || guess > 100) {
          console.log("Please enter a valid number between 1 and 100.");
          askGuess();
          return;
        }

        if (guess === randomNumber) {
          console.log(
            `🎉 Congratulations! You guessed the correct number in ${attempts} attempts.`
          );
          askPlayAgain();
          // rl.close();
        } else if (attempts >= maxAttempts) {
          console.log(`Game over! The correct number was ${randomNumber}.`);
          askPlayAgain();
        } else if (guess < randomNumber) {
          console.log(`Incorrect! The number is greater than ${guess}.`);
          askGuess();
        } else {
          console.log(`Incorrect! The number is less than ${guess}.`);

          askGuess();
        }
      });
    };

    askGuess();
  });

  // To ask if the player wants to play again
  function askPlayAgain() {
    rl.question("\nDo you want to play again? (y/n): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        startGame();
      } else {
        console.log("Thanks for playing! Goodbye ");
        rl.close();
      }
    });
  }
}

// Start for the first time
startGame();
