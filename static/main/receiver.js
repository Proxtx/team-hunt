import { rebuild } from "/modules/compare/main.js";
import { update } from "./gameStateManagement.js";
import { meta } from "../lib/apiLoader.js";
import { hashObj } from "../lib/hash.js";
import * as _ from "./captureLogic.js";

export const pwd = cookie.pwd;

export const username = cookie.username;

export let gameState = {};

export const getGameStateHash = () => {
  return { success: true, hash: hashObj(gameState) };
};

export const updateGameState = (rebuildUpdate) => {
  if (!connectionCheckLoopRunning) {
    connectionCheckLoop();
    connectionCheckLoopRunning = true;
  }

  let newGameState = rebuild(JSON.stringify(gameState), rebuildUpdate);
  try {
    let parsedGameState = JSON.parse(newGameState);
    gameState = parsedGameState;
    update();
    return { success: true, transmitSuccess: true };
  } catch (e) {
    console.log("Error updating game state!", e);
    return { success: true, transmitSuccess: false };
  }
};

export const getLocation = async () => {
  let location = await new Promise((r) =>
    navigator.geolocation.getCurrentPosition(r, r)
  );

  if (location.code) {
    return { success: true, locationSuccess: false };
  }

  return {
    success: true,
    locationSuccess: true,
    location: [location.coords.latitude, location.coords.longitude],
  };
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
