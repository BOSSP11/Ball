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
  y: 100,
  radius: 60,
  color: localStorage.getItem("ballColor") || "#ff4757",
  velocityX: 7,
  velocityY: 9
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

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  ball.velocityY += 0.45;

  if (ball.y + ball.radius > canvas.height) {
    gameOver();
  }

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.velocityX = -ball.velocityX;
  }
}

// Game over handler
function gameOver() {
  isGameOver = true;
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");

  // Update highest score if needed
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore);
    highestScoreEl.textContent = highestScore;
  }

  // Update lowest score if needed
  if (lowestScore === 0 || score < lowestScore) {
    lowestScore = score;
    localStorage.setItem("recentScore", lowestScore);
    lowestScoreEl.textContent = lowestScore;
  }
}

// Unified score update function
function updateScoreBoard() {
  scoreBoard.innerHTML = `Score: ${score} Recent: <span id="recentScore">${lowestScore}</span> | Highest: <span id="highestScore">${highestScore}</span>`;
}

// Click event
canvas.addEventListener("click", (e) => {
  if (isGameOver) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const distance = Math.sqrt(
    (clickX - ball.x) ** 2 + (clickY - ball.y) ** 2
  );

  if (distance <= ball.radius) {
    ball.velocityX = -12;
    ball.velocityY = -12;
    score++;
    updateScoreBoard();
  }
});

// Touch event — with passive:false for preventDefault()
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (isGameOver) return;

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;

  const distance = Math.sqrt(
    (touchX - ball.x) ** 2 + (touchY - ball.y) ** 2
  );

  if (distance <= ball.radius) {
    ball.velocityX = -12;
    ball.velocityY = -12;
    score++;
    updateScoreBoard();
  }
}, { passive: false });

// Restart button
restartButton.addEventListener("click", () => {
  resetGame();
});

// Reset game state
function resetGame() {
  score = 0;
  isGameOver = false;

  ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
  ball.y = 100;
  ball.velocityX = 7;
  ball.velocityY = 9;
  ball.color = localStorage.getItem("ballColor") || "#ff4757";

  updateScoreBoard();
  gameOverScreen.classList.add("hidden");
}

// Game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
