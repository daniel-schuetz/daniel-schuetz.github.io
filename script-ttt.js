import { checkWin, checkDraw } from './gameState.js';
import { resetRound, resetGame } from './gameControl.js'

const p1 = "<span class='red-x'>X</span>";
const p2 = "<span class='blue-o'>O</span>";

const scoreCounter = {p1: 0, p2: 0, draw: 0};

const gameState = {
  hasEnded: false,
  cellId: null,
  moveCount: 1,
  startingPlayer: 1,
  activePlayer: 1,
  surrendered: null,
};

/*
// TO DO: change to object!
let cellId = null;
let gameHasEnded = false;
let moveCount = 1;
let startingPlayer = 1; // later: starting player can change
let activePlayer = startingPlayer;
*/

const capFirst = str => str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;

const cellStatus = {
  a1: null, b1: null, c1: null,
  a2: null, b2: null, c2: null,
  a3: null, b3: null, c3: null,
};

const gameStateMsg = {
  gsmsg1: "Game is running",
  gsmsg2: "It is player " + gameState.activePlayer + "'s turn",
  gsmsg3: null
}

updateCellStateBox ();
updateGameStateBox ();

const gameBoard = document.querySelector(".game-board");
const resetBtn = document.getElementById("reset-button");
const toggleStartBtn = document.getElementById("surrender-new-round-button");
// const newRoundBtn = document.getElementById("new-round-button"); 
// const surrenderBtn = document.getElementById("surrender-button"); 
const statusBox = document.getElementById("game-status");

gameBoard.addEventListener("click", (e) => {
  if (gameState.hasEnded) {
    return;
  }
  
  if (e.target.matches(".game-cell")) {
    let selectedCell = e.target;
    gameState.cellId = selectedCell.id;
    
    if (invalidMove(selectedCell, gameState.cellId)) {
      return;
    }

    console.log(selectedCell);
    
    setStatus(gameState.cellId);
    enterSymbol(selectedCell);
    
    console.log(cellStatus);

    if (gameOver()) { // TODO: check if game is over
      gameState.hasEnded = true;
      toggleStartBtn.textContent = "New round";
      updateGameHistory(gameState);
      console.log("Game is over");
      gameStateMsg.gsmsg1 = "Game is over";
      // alert("Game over");
    }

    else {
      console.log("Game not over");
      updateGameHistory(gameState);
      gameState.activePlayer === 1 ? (gameState.activePlayer = 2) : (gameState.activePlayer = 1);
      gameStateMsg.gsmsg2 = "It is player " + gameState.activePlayer + "'s turn";
      gameState.moveCount++;
    }

    updateCellStateBox ();
    updateGameStateBox ();
    updateScoreboard();
  }
});

function invalidMove (cell, id) {
  if (cellStatus[id] != null || cell.innerText !== "") {
    alert("Invalid move: Select a free cell!");
    return true;
  }
  return false;
}

function setStatus(id) {
  if (cellStatus[id] == null) {
    gameState.activePlayer === 1 ? cellStatus[id] = "p1" : cellStatus[id] = "p2";
  }
}

function enterSymbol (cell) {
  if (cell.innerText === "") {
    gameState.activePlayer === 1 ? cell.innerHTML = p1 : cell.innerHTML = p2;
  }
}

function updateCellStateBox () {
  const cellStateOutp = document.getElementById("cell-state-output");
  
  const statusParagraphs = document.querySelectorAll(".status-paragraph");
  statusParagraphs.forEach((paragraph) => {
    paragraph.remove();
  });

  const cellStatusValues = Object.values(cellStatus);
  const abc = ["a", "b", "c"]

  for (let i = 1; i <= 3; i++) {
    const line = extractLines(cellStatusValues, i);
    const l = abc [i-1];

    let statusContent = document.createElement("p");
    statusContent.className = "status-paragraph";
    for (let x = 0; x <= 2; x++) {
      let y = x+1;
      statusContent.textContent += l + y +":" + line[x] + " | "
    }
    cellStateOutp.appendChild(statusContent);
  }
}

function updateGameStateBox () {
  const gsmsg1 = document.getElementById("gsmsg1");
  const gsmsg2 = document.getElementById("gsmsg2");
  const gsmsg3 = document.getElementById("gsmsg3");
  
  gsmsg1.innerText = gameStateMsg.gsmsg1;
  gsmsg2.innerText = gameStateMsg.gsmsg2;
  gsmsg3.innerText = gameStateMsg.gsmsg3;
}

function updateGameHistory(status) {
  const drawHistory = document.getElementById("draw-history");

    let historyRow = document.createElement("tr");
    historyRow.className = "history-row";
    if (status.hasEnded) {
      if (checkWin(cellStatus) || status.surrendered){
          historyRow.classList.add("history-end-win")   
      } else {
          historyRow.classList.add("history-end-draw") 
        } 
    }

    let histMoveCount = document.createElement("td");
    histMoveCount.innerText = gameState.moveCount;

    let histMoveLeft = document.createElement("td");
    let histMoveRight = document.createElement("td");

    if (status.surrendered) {
      histMoveLeft.className = "surrender";
      histMoveLeft.colspan = 2;
      histMoveRight.className = "empty";
      histMoveLeft.innerText = "P" + status.surrendered + "has surrendered";
    } else {
      histMoveLeft.className = "history-p1";
      histMoveRight.className = "history-p2";
      gameState.activePlayer === 1 ? histMoveLeft.innerText = gameState.cellId : histMoveRight.innerText = gameState.cellId;
    }

    drawHistory.appendChild(historyRow);
    historyRow.append(histMoveCount, histMoveLeft, histMoveRight);
}

function updateScoreboard() {
  const p1WinsDisplay = document.getElementById("show-p1-wins");
  const p2WinsDisplay = document.getElementById("show-p2-wins");
  const drawsDisplay = document.getElementById("show-draws");

  p1WinsDisplay.innerText = scoreCounter.p1;
  p2WinsDisplay.innerText = scoreCounter.p2;
  drawsDisplay.innerText = scoreCounter.draw;
}

function extractLines (arr, n) {
  let i = (n - 1) * 3;
  return [arr[i], arr[i+1], arr[i+2]]
}

function gameOver() {
  if (checkWin(cellStatus)) {
    gameState.activePlayer === 1 ? scoreCounter.p1++ : scoreCounter.p2++;
    gameStateMsg.gsmsg2 = "Player " + gameState.activePlayer + " has won!";
    return true;
  } else if (checkDraw(cellStatus)) {
    scoreCounter.draw++;
    gameStateMsg.gsmsg2 = "It's a draw!";
    return true;
  } else {
    return false;
  }
}

// Combined Surrender / Start New Round Button
toggleStartBtn.addEventListener("click", () => {
  if (gameState.hasEnded) {
    resetRound(gameState, cellStatus);
    updateCellStateBox ();
    updateGameStateBox ();
    toggleStartBtn.textContent = "Give Up";
  } else {
    gameState.hasEnded = true;
    gameState.activePlayer === 1 ? gameState.surrendered = 1 : gameState.surrendered = 2;
    gameState.activePlayer === 1 ? scoreCounter.p2++ : scoreCounter.p1++;
    updateGameHistory(gameState);
    updateScoreboard();
    toggleStartBtn.textContent = "New round";
  }
});

/*
toggleButton.addEventListener("click", () => {
  if (timer === null) {
    // Timer starten

    startTimer();

    toggleButton.textContent = "Pause";
  } else {
    // Timer pausieren
    clearInterval(timer);
    timer = null;
    toggleButton.textContent = "Fortsetzen";
  }
});
*/

/*
// Surrender Button
surrenderBtn.addEventListener("click", () => {
  if (!gameState.hasEnded) {
    gameState.hasEnded = true;
    gameState.activePlayer === 1 ? gameState.surrendered = 2 : gameState.surrendered = 1;
    gameState.activePlayer === 1 ? scoreCounter.p2++ : scoreCounter.p1++;
    updateGameHistory(gameState);
    updateScoreboard();
  }
});

// New Round Button
newRoundBtn.addEventListener("click", () => {
  if (gameState.hasEnded) {
    resetRound(gameState, cellStatus);
    updateCellStateBox ();
    updateGameStateBox ();
  }
});

*/

// Reset-Button
resetBtn.addEventListener("click", () => {
  resetGame(gameState, cellStatus, scoreCounter);
  updateCellStateBox ();
  updateGameStateBox ();
  updateScoreboard();
});

