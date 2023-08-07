import { gameState } from "./gameState.js";
import { updateLocatorLocationLoop } from "./locator.js";

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
  revealLocation();
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

export const revealLocation = async () => {
  gameState.gameState.runnerInformation.publicLocatorLocation = [
    ...gameState.gameState.runnerInformation.locatorLocation,
  ];
  gameState.gameState.runnerInformation.fakeLocations = [
    ...gameState.gameState.runnerInformation.pendingFakeLocations,
  ];
  gameState.gameState.liveInformation.lastLocationReveal = Date.now();

  await gameState.saveGameState();
};

const locationRevealLoop = async () => {
  if (!gameState.gameState.liveInformation.lastLocationReveal)
    await revealLocation();

  if (
    gameState.gameState.config.locationRevealInterval -
      (Date.now() - gameState.gameState.liveInformation.lastLocationReveal) <=
    0
  )
    await revealLocation();
  setTimeout(
    () => locationRevealLoop(),
    gameState.gameState.config.locationRevealInterval -
      (Date.now() - gameState.gameState.liveInformation.lastLocationReveal)
  );
};

export const fakeLocation = async (index, location) => {
  let locationIndex = 0;
  while (locationIndex < index) {
    if (
      !gameState.gameState.runnerInformation.pendingFakeLocations[locationIndex]
    )
      gameState.gameState.runnerInformation.pendingFakeLocations[
        locationIndex
      ] = location;

    locationIndex++;
  }
  gameState.gameState.runnerInformation.pendingFakeLocations[index] = location;

  await gameState.saveGameState();
};

locationRevealLoop();
updateLocatorLocationLoop();
