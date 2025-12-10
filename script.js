const menu = document.getElementById("menu");
const playerName = document.getElementById("player-name");
const btnPlay = document.getElementById("btn-play");
const board = document.getElementById("board");

const pauseScreen = document.getElementById("pause-screen");
const btnPause = document.getElementById("btn-pause");
const resumeBtn = document.getElementById("resume-btn");
const quitBtn = document.getElementById("quit-btn");

const gameoverScreen = document.getElementById("gameover-screen");
const restartBtn = document.getElementById("restart-btn");
const menuBtn = document.getElementById("menu-btn");

const finishedScreen = document.getElementById("finished-screen");
const finishedRestartBtn = document.getElementById("finished-restart-btn");
const finishedMenuBtn = document.getElementById("finished-menu-btn");

// Player name input validation
playerName.addEventListener("input", (e) => {
  if (e.target.value) {
    btnPlay.disabled = false;
  } else {
    btnPlay.disabled = true;
  }
});

// Enter key to start game
playerName.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!btnPlay.disabled) {
      btnPlay.click();
    }
  }
});

// Play button
btnPlay.addEventListener("click", () => {
  menu.style.display = "none";
  board.style.display = "block";
  startGame();
});

// Pause button
btnPause.addEventListener("click", () => {
  pauseGame();
});

// Space key to toggle pause
window.addEventListener("keydown", (e) => {
  if (e.key === " " || e.code === "Escape") {
    e.preventDefault();
    if (board.style.display === "none") return;
    if (isGameOver) return;

    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});

// Resume button
resumeBtn.addEventListener("click", () => {
  resumeGame();
});

// Quit button (go to menu)
quitBtn.addEventListener("click", () => {
  pauseScreen.classList.add("hidden");
  board.style.display = "none";
  menu.style.display = "flex";
  resetGame();
});

// Restart button
restartBtn.addEventListener("click", () => {
  gameoverScreen.classList.add("hidden");
  resetGame();
  startGame();
});

// Menu button
menuBtn.addEventListener("click", () => {
  gameoverScreen.classList.add("hidden");
  board.style.display = "none";
  menu.style.display = "flex";
  resetGame();
});

// Finished screen - Restart button
finishedRestartBtn.addEventListener("click", () => {
  finishedScreen.classList.add("hidden");
  resetGame();
  startGame();
});

// Finished screen - Menu button
finishedMenuBtn.addEventListener("click", () => {
  finishedScreen.classList.add("hidden");
  board.style.display = "none";
  menu.style.display = "flex";
  resetGame();
});
