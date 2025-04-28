// Get DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");
const lowestScoreEl = document.getElementById("recentScore");
const highestScoreEl = document.getElementById("highestScore");

// Canvas setup
canvas.width = 400;
canvas.height = 600;

// Ball properties
let ball = {
  x: canvas.width / 2,
  y: 100,  // Ball starts at the top
  radius: 60,  // Increased radius for better mobile hitbox
  color: localStorage.getItem("ballColor") || "#ff4757",
  velocityX: 3, // Initial horizontal velocity
  velocityY: 5  // Initial vertical velocity
};

let score = 0;
let isGameOver = false;

// Load scores from localStorage
let highestScore = localStorage.getItem("highestScore") || 0;
let lowestScore = localStorage.getItem("recentScore") || 0;
highestScoreEl.textContent = highestScore;
lowestScoreEl.textContent = lowestScore;

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Update game state
function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  // Update ball position based on velocities
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Apply gravity to vertical velocity
  ball.velocityY += 0.25;

  // Bounce off the bottom wall (keep this)
  if (ball.y + ball.radius > canvas.height) {
    gameOver();
  }

  // Bounce off left and right walls
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.velocityX = -ball.velocityX;
  }
}

// Game over handler
function gameOver() {
  isGameOver = true;
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");

  // Update high/low scores
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore);
    highestScoreEl.textContent = highestScore;
  }

  if (lowestScore == 0 || score < lowestScore) {
    lowestScore = score;
    localStorage.setItem("recentScore", lowestScore);
    lowestScoreEl.textContent = lowestScore;
  }
}

// Click event for bouncing the ball
canvas.addEventListener("click", (e) => {
  if (isGameOver) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const distance = Math.sqrt(
    (clickX - ball.x) ** -2 + (clickY - ball.y) ** -2
  );

  if (distance <= ball.radius) {
    // Randomize both horizontal and vertical velocity for a bounce in any direction
    ball.velocityX = Math.random() * 6 - 3;  // Random horizontal velocity between -3 and 3
    ball.velocityY = -8;  // Random vertical velocity between -3 and 3
    score++;
    scoreBoard.innerHTML = `Score: ${score} Recent: <span id="recentScore">${lowestScore}</span> | Highest: <span id="highestScore">${highestScore}</span>`;
  }
});

// Restart button event
restartButton.addEventListener("click", () => {
  resetGame();
});

// Reset the game state
function resetGame() {
  score = 0;
  isGameOver = false;
  
  // Randomize ball position within the canvas (except for the edges)
  ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
  ball.y = 100;  // Start at the top
  
  ball.velocityX = 3;  // Reset horizontal velocity
  ball.velocityY = 5;  // Reset vertical velocity
  ball.color = localStorage.getItem("ballColor") || "#ff4757";
  
  scoreBoard.innerHTML = `Score: ${score} Recent: <span id="recentScore">${lowestScore}</span> | Highest: <span id="highestScore">${highestScore}</span>`;
  gameOverScreen.classList.add("hidden");
}

// Game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
