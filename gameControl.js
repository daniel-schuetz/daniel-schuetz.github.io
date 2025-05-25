import { checkWin, checkDraw } from './gameState.js';

export function resetRound(gState, cState) {
  // resets cellStatus object
  for (let key in cState) {
    cState[key] = null;
  }
  
  // reset all cells to empty
  const cells = document.querySelectorAll(".game-cell");
  cells.forEach((cell) => {
    cell.innerText = "";
  });

  // remove all history rows
  const historyRows = document.querySelectorAll(".history-row");
  historyRows.forEach((row) => {
    row.remove();
  });

  /*
  // remove all status paragraphs
  const historyParagraphs = document.querySelectorAll(".history-paragraph");
  historyParagraphs.forEach((paragraph) => {
    paragraph.remove();
  }); */

  // resets active player to 1 - LATER: starting player can change 
  switchStartingPlayer(cState, gState);
  
  gState.moveCount = 1;
  gState.hasEnded = false;
  gState.activePlayer = gState.startingPlayer;
  gState.surrendered = null;

  console.log(cState);
}


export function resetGame(status, cells, counter) {
  
  resetRound(status, cells);
  
  counter.p1 = 0;
  counter.p2 = 0;
  counter.draw = 0;

  status.startingPlayer = 1;
}

function switchStartingPlayer(cells, game) {
  if (checkWin(cells)) {
    game.startingPlayer = game.activePlayer;
  } else if (checkDraw()) {
    game.startingPlayer = (game.startingPlayer === 1 ? 2 : 1);
  }
}


/*

disableGame() / enableGame()	    Optional: Blockieren/Entblockieren von Eingaben
handleSurrender()	                Reagiert auf Klick auf "Aufgeben"
prepareNewRound(startingPlayer)	    Wechselt Startspieler, setzt Spiel zurück
*/