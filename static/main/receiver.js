import { rebuild } from "/modules/compare/main.js";
import { update } from "./gameStateManagement.js";
import { meta } from "../lib/apiLoader.js";

export const pwd = cookie.pwd;

export const username = cookie.username;

export let gameState = {};

export const updateGameState = (rebuildUpdate) => {
  if (!connectionCheckLoopRunning) {
    connectionCheckLoop();
    connectionCheckLoopRunning = true;
  }

  let newGameState = rebuild(JSON.stringify(gameState), rebuildUpdate);
  try {
    let parsedGameState = JSON.parse(newGameState);
    gameState = parsedGameState;
    console.log(parsedGameState);
    update();
    return { success: true, transmitSuccess: true };
  } catch (e) {
    console.log("Error updating game state!", e);
    return { success: true, transmitSuccess: false };
  }
};

let connectionCheckLoopRunning = false;
let confirmed = false;
export const confirmConnection = async () => {
  confirmed = true;
  return { success: true };
};

const connectionCheckLoop = async () => {
  confirmed = false;
  await new Promise((r) => {
    meta.checkConnection(pwd, username).then(r);
    setTimeout(r, 3000);
  });

  if (!confirmed) {
    alert(
      "Während eines Routine-Verbindungs-Checks wurde ein Fehler festgestellt. Die Webseite wird neugeladen!"
    );
    location.reload();
  }

  setTimeout(() => connectionCheckLoop(), 15000);
};
