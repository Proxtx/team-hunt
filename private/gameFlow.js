import { gameState } from "./gameState.js";

export const startGame = async () => {
  if (gameState.gameState.liveInformation.state != "preparing")
    return { success: false, error: 2 };

  gameState.gameState.liveInformation.startTime = Date.now();
  gameState.gameState.teams[
    Math.floor(Math.random() * gameState.gameState.teams.length)
  ].role = "runner";
  for (let team of gameState.gameState.teams) {
    if (team.role == "runner") continue;
    team.teamsTimeoutOnCapture = Date.now();
  }
  //TODO: Reveal Location
  gameState.gameState.liveInformation.state = "running";

  appendLog("Game started.");
  await gameState.saveGameState();

  return { success: true };
};

export const stopGame = async () => {
  gameState.gameState.liveInformation.state = "ended";
  appendLog("Game stopped");
  await gameState.saveGameState();

  return { success: true };
};

export const appendLog = async (text) => {
  gameState.gameState.liveInformation.log.push({ text, time: Date.now() });
};
