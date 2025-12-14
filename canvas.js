const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Game constants
const BOARD_WIDTH = 960;
const BOARD_HEIGHT = 600;
const TARGET_SIZE = 60;
const SCOPE_SIZE = 50;
const TARGET_SPEED = 3;
const SPAWN_INTERVAL = 2000;
const MAX_TARGETS = 5;
const MIN_TARGETS = 1;

// Load images
const targetImg = new Image();
targetImg.src = "./assets/target-removebg-preview.png";

const scopeImg = new Image();
scopeImg.src = "./assets/cursor-scope-removebg-preview.png";

const heartImg = new Image();
heartImg.src = "./assets/user-lives-removebg-preview.png";

// Game state
let currentUsername = "";
let scoreCount = 0;
let lives = 3;
let timeLeft = 60;
let isPaused = false;
let isGameOver = false;

// Mouse position
let mouseX = BOARD_WIDTH / 2;
let mouseY = BOARD_HEIGHT / 2;

// Targets array
let targets = [];

// Intervals
let gameLoopId;
let timerInterval;
let spawnInterval;

// Draw background (simple gradient)
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, BOARD_HEIGHT);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  // Ground
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, BOARD_HEIGHT - 50, BOARD_WIDTH, 50);
}

// Draw target using image
function drawTarget(x, y) {
  ctx.drawImage(targetImg, x, y, TARGET_SIZE, TARGET_SIZE);
}

// Draw scope/crosshair using image
function drawScope(x, y) {
  const halfSize = SCOPE_SIZE / 2;
  ctx.drawImage(scopeImg, x - halfSize, y - halfSize, SCOPE_SIZE, SCOPE_SIZE);
}

// Spawn new target
function spawnTarget() {
  if (targets.length >= MAX_TARGETS || isPaused || isGameOver) return;

  const x = Math.random() * (BOARD_WIDTH - TARGET_SIZE);
  const y = -TARGET_SIZE;

  targets.push({ x, y });
}

// Update targets position
function updateTargets() {
  if (isPaused || isGameOver) return;

  for (let i = targets.length - 1; i >= 0; i--) {
    targets[i].y += TARGET_SPEED;

    // Target reached bottom
    if (targets[i].y > BOARD_HEIGHT) {
      targets.splice(i, 1);
      scoreCount -= 5;
      if (scoreCount < 0) scoreCount = 0;
      lives--;
      updateLivesDisplay();
      updateScoreDisplay();

      if (lives <= 0) {
        gameOver();
      }
    }
  }

  // Ensure minimum targets
  if (targets.length < MIN_TARGETS && !isGameOver) {
    spawnTarget();
  }
}

// Draw all targets
function drawTargets() {
  targets.forEach((target) => {
    drawTarget(target.x, target.y);
  });
}

// Check if click hits a target
function checkHit(clickX, clickY) {
  for (let i = targets.length - 1; i >= 0; i--) {
    const target = targets[i];
    const centerX = target.x + TARGET_SIZE / 2;
    const centerY = target.y + TARGET_SIZE / 2;
    const distance = Math.sqrt(
      Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
    );

    if (distance <= TARGET_SIZE / 2) {
      // Hit!
      targets.splice(i, 1);
      scoreCount += 10;
      updateScoreDisplay();
      return true;
    }
  }
  return false;
}

// Update score display
function updateScoreDisplay() {
  document.getElementById("score").innerText = scoreCount;
}

// Update lives display using heart images
function updateLivesDisplay() {
  const livesContainer = document.getElementById("lives");
  livesContainer.innerHTML = "";
  
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement("img");
    heart.src = "./assets/user-lives-removebg-preview.png";
    heart.style.width = "24px";
    heart.style.height = "24px";
    heart.style.marginRight = "4px";
    livesContainer.appendChild(heart);
  }
  
  if (lives === 0) {
    livesContainer.innerText = "💔";
  }
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").innerText = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (isPaused || isGameOver) return;

    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      if (lives > 0) {
        gameFinished();
      } else {
        gameOver();
      }
    }
  }, 1000);
}

// Start spawn interval
function startSpawning() {
  spawnInterval = setInterval(() => {
    if (!isPaused && !isGameOver) {
      spawnTarget();
    }
  }, SPAWN_INTERVAL);
}

// Game finished (timer ended, still alive)
function gameFinished() {
  isGameOver = true;
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);

  const finishedScreen = document.getElementById("finished-screen");
  const finishedScore = document.getElementById("finished-score");
  const finishedHighScoreEl = document.getElementById("finished-high-score");
  const finishedNewHighscoreMsg = document.getElementById("finished-new-highscore");

  let highScore = parseInt(localStorage.getItem("archeryHighScore")) || 0;

  finishedScore.innerText = scoreCount;

  if (scoreCount > highScore) {
    highScore = scoreCount;
    localStorage.setItem("archeryHighScore", highScore);
    finishedNewHighscoreMsg.classList.remove("hidden");
  } else {
    finishedNewHighscoreMsg.classList.add("hidden");
  }

  finishedHighScoreEl.innerText = highScore;
  finishedScreen.classList.remove("hidden");
}

// Game over (lives = 0)
function gameOver() {
  isGameOver = true;
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);

  const gameoverScreen = document.getElementById("gameover-screen");
  const finalScore = document.getElementById("final-score");
  const highScoreEl = document.getElementById("high-score");
  const newHighscoreMsg = document.getElementById("new-highscore");

  let highScore = parseInt(localStorage.getItem("archeryHighScore")) || 0;

  finalScore.innerText = scoreCount;

  if (scoreCount > highScore) {
    highScore = scoreCount;
    localStorage.setItem("archeryHighScore", highScore);
    newHighscoreMsg.classList.remove("hidden");
  } else {
    newHighscoreMsg.classList.add("hidden");
  }

  highScoreEl.innerText = highScore;
  gameoverScreen.classList.remove("hidden");
}

// Pause game
function pauseGame() {
  if (isGameOver) return;
  isPaused = true;
  document.getElementById("pause-screen").classList.remove("hidden");
}

// Resume game
function resumeGame() {
  isPaused = false;
  document.getElementById("pause-screen").classList.add("hidden");
  gameLoop();
}

// Mouse move handler
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// Click handler
canvas.addEventListener("click", (e) => {
  if (isPaused || isGameOver) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  checkHit(clickX, clickY);
});

// Game loop
function gameLoop() {
  if (isPaused || isGameOver) return;

  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
  drawBackground();
  updateTargets();
  drawTargets();
  drawScope(mouseX, mouseY);

  gameLoopId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
  currentPlayerName = playerName.value || "Player";
  scoreCount = 0;
  lives = 3;
  timeLeft = 60;
  isPaused = false;
  isGameOver = false;
  targets = [];

  updateScoreDisplay();
  updateLivesDisplay();
  updateTimerDisplay();

  for (let i = 0; i < MIN_TARGETS; i++) {
    spawnTarget();
  }

  startTimer();
  startSpawning();
  gameLoop();
}

// Reset game
function resetGame() {
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);

  scoreCount = 0;
  lives = 3;
  timeLeft = 60;
  isPaused = false;
  isGameOver = false;
  targets = [];
}
