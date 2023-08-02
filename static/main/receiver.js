import { rebuild } from "/modules/compare/main.js";
import { update } from "./gameStateManagement.js";

export const pwd = cookie.pwd;

export const username = cookie.username;

export let gameState = {};

export const updateGameState = (rebuildUpdate) => {
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
