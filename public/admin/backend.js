import { auth } from "./meta.js";
import { gameState, defaultGameState } from "../../private/gameState.js";

export const getCurrentGameState = (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  return { success: true, gameState: gameState.gameState };
};

export const resetGame = async (pwd) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  await gameState.overwriteGameState(
    JSON.parse(JSON.stringify(defaultGameState))
  );
  return { success: true };
};
