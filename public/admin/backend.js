import { auth } from "./meta.js";
import { gameState } from "../../private/gameState.js";
import * as gameFlow from "../../private/gameFlow.js";

export const getCurrentGameState = (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  return { success: true, gameState: gameState.gameState };
};

export const startGame = async (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  return await gameFlow.startGame();
};

export const stopGame = async (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  return await gameFlow.stopGame();
};

export const updateConfig = async (pwd, attribute, value) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  gameState.gameState.config[attribute] = value;
  gameFlow.appendLog("Updated Rules.");
  await gameState.saveGameState();
  return { success: true };
};
