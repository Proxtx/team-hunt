import { gameState } from "./gameState.js";
import { updateLocationsLoop } from "./location.js";

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

  appendLog("Location reveal");

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
  if (
    gameState.gameState.runnerInformation.pendingFakeLocations.length >
    gameState.gameState.config.fakeLocationAmount
  )
    gameState.gameState.runnerInformation.pendingFakeLocations.length =
      gameState.gameState.config.fakeLocationAmount;
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

export const changeRunner = async (newRunnerTeamIndex) => {
  for (let teamIndex in gameState.gameState.teams) {
    if (gameState.gameState.teams[teamIndex].role == "runner") {
      gameState.gameState.teams[teamIndex].caughtTimeout = Date.now();
      gameState.gameState.teams[teamIndex].role = "hunter";
    } else if (teamIndex == newRunnerTeamIndex) {
      gameState.gameState.teams[teamIndex].role = "runner";
    } else {
      gameState.gameState.teams[teamIndex].teamsTimeoutOnCapture = Date.now();
    }
  }

  appendLog(
    "Team " + (Number(newRunnerTeamIndex) + 1) + " ist nun das Läufer Team!"
  );

  await revealLocation();

  return { success: true };
};

locationRevealLoop();
updateLocationsLoop();
