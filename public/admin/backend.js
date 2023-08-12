import { auth } from "./meta.js";
import { setLocatorUserOverwrite } from "../../private/location.js";
import { gameState, defaultGameState } from "../../private/gameState.js";
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

export const resetGame = async (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  await gameState.overwriteGameState(
    JSON.parse(JSON.stringify(defaultGameState))
  );
  return { success: true };
};

export const updateConfig = async (pwd, attribute, value) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  gameState.gameState.config[attribute] = value;
  gameFlow.appendLog("Updated Rules.");
  await gameState.saveGameState();
  return { success: true };
};

export const getUsers = (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  return { success: true, users: Object.keys(gameState.gameState.users) };
};

export const setUserOverwrite = (pwd, user) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  setLocatorUserOverwrite(user);
  return { success: true };
};
