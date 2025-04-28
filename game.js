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
function resizeCanvas() {
  // Make the canvas responsive
  canvas.width = window.innerWidth * 0.9;  // 90% of screen width
  canvas.height = window.innerHeight * 0.7;  // 70% of screen height

  // Update the scale factor to account for device pixel ratio
  const scaleFactor = window.devicePixelRatio || 1;
  canvas.width = canvas.width * scaleFactor;
  canvas.height = canvas.height * scaleFactor;
  ctx.scale(scaleFactor, scaleFactor);  // Scale the canvas context accordingly

  // Adjust ball size based on screen size
  ball.radius = Math.min(canvas.width, canvas.height) * 0.1; // Make ball size proportional
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);  // Ensure resizing when screen size changes

// Ball properties
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: Math.min(canvas.width, canvas.height) * 0.1,  // Adjust size based on screen size
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

// Touch event for bouncing the ball (for mobile)
canvas.addEventListener("touchstart", (e) => {
  if (isGameOver) return;

  // Get touch position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const scaleFactor = window.devicePixelRatio || 1;  // Consider scaling factor for pixel density
  const touchX = (e.touches[0].clientX - rect.left) * scaleFactor;
  const touchY = (e.touches[0].clientY - rect.top) * scaleFactor;

  const distance = Math.sqrt(
    (touchX - ball.x) ** 2 + (touchY - ball.y) ** 2
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
  
  // Set the ball to the center of the canvas
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  
  // Set a vertical downward velocity for the ball to fall straight down
  ball.velocityX = 0;  // Keep the horizontal velocity at 0 for vertical fall
  ball.velocityY = 5;  // Set vertical velocity for falling effect
  
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
