document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreBoard = document.getElementById("scoreBoard");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const finalScore = document.getElementById("finalScore");
  const restartButton = document.getElementById("restartButton");
  const lowestScoreEl = document.getElementById("recentScore");
  const highestScoreEl = document.getElementById("highestScore");

  // Responsive canvas setup
  function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 400);
    canvas.height = Math.min(window.innerHeight * 0.7, 600);
    ball.radius = canvas.width * 0.15; // Ball radius is 15% of canvas width
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Ball properties
  let ball = {
    x: canvas.width / 2,
    y: 100,
    radius: canvas.width * 0.15,
    color: localStorage.getItem("ballColor") || "#ff4757",
    velocityX: 3,
    velocityY: 5
  };

  let score = 0;
  let isGameOver = false;

  let highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
  let lowestScore = parseInt(localStorage.getItem("recentScore")) || 0;

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

    ball.velocityY += 0.25;

    if (ball.y + ball.radius > canvas.height) {
      gameOver();
    }

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.velocityX = -ball.velocityX;
    }
  }

  function updateScoreBoard() {
    scoreBoard.innerHTML = `Score: ${score} Recent: <span id="recentScore">${lowestScore}</span> | Highest: <span id="highestScore">${highestScore}</span>`;
  }

  function gameOver() {
    isGameOver = true;
    finalScore.textContent = score;
    gameOverScreen.classList.remove("hidden");

    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem("highestScore", highestScore);
      highestScoreEl.textContent = highestScore;
    }

    if (lowestScore === 0 || score < lowestScore) {
      lowestScore = score;
      localStorage.setItem("recentScore", lowestScore);
      lowestScoreEl.textContent = lowestScore;
    }
  }

  // Universal tap/click handler
  function handleBounce(x, y) {
    if (isGameOver) return;

    const distance = Math.hypot(x - ball.x, y - ball.y);

    // Hit tolerance for mobile (1.1x radius)
    if (distance <= ball.radius * 1.15) {
      ball.velocityX = Math.random() * 6 - 3;
      ball.velocityY = -8;
      score++;
      updateScoreBoard();
    }
  }

  // Click event
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    handleBounce(clickX, clickY);
  });

  // Touch event (mobile tap)
  canvas.addEventListener("touchstart", (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    handleBounce(touchX, touchY);
  });

  // Restart button
  restartButton.addEventListener("click", () => {
    resetGame();
  });

  function resetGame() {
    score = 0;
    isGameOver = false;
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = 100;
    ball.velocityX = 3;
    ball.velocityY = 5;
    ball.color = localStorage.getItem("ballColor") || "#ff4757";
    updateScoreBoard();
    gameOverScreen.classList.add("hidden");
  }

  function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
  }

  updateScoreBoard();
  gameLoop();
});
