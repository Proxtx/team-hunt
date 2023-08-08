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

  gameState.gameState.liveInformation.state = "running";

  appendLog("Game started.");

  await revealLocation();

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
  if (!gameState.gameState.runnerInformation.locatorLocation) {
    console.log(
      "Was unable to reaveal location due to there being no locator location!"
    );
    return;
  }

  if (gameState.gameState.liveInformation.state != "running") {
    console.log("Did not update location because the game is not running");
    return;
  }

  gameState.gameState.runnerInformation.publicLocatorLocation = [
    ...gameState.gameState.runnerInformation.locatorLocation,
  ];
  gameState.gameState.runnerInformation.fakeLocations = [
    ...gameState.gameState.runnerInformation.pendingFakeLocations,
  ];
  gameState.gameState.liveInformation.publiclyCapturedLocations =
    gameState.gameState.liveInformation.publiclyCapturedLocations.concat(
      gameState.gameState.runnerInformation.capturedLocations
    );
  gameState.gameState.runnerInformation.capturedLocations = [];

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

export const claimLocation = async (location) => {
  let alreadyCapturedLocations =
    gameState.gameState.liveInformation.publiclyCapturedLocations.concat(
      gameState.gameState.runnerInformation.capturedLocations
    );
  if (alreadyCapturedLocations.includes(location))
    return { success: false, error: 1 };

  let exists = false;
  for (let configLocation of gameState.gameState.config.locations) {
    if (configLocation.name == location) exists = true;
  }

  if (!exists) return { success: false, error: 1 };

  for (let team of gameState.gameState.teams) {
    if (team.role == "runner") team.points++;
  }

  gameState.gameState.runnerInformation.capturedLocations.push(location);

  appendLog("A location was captured!");

  if (gameState.gameState.config.revealCaptures) {
    return await revealLocation();
  } else {
    await gameState.saveGameState();
    return { success: true };
  }
};

export const createUser = async (username, team) => {
  team--;
  if (!gameState.gameState.teams[team]) return { success: false, error: 1 };
  if (gameState.gameState.users[username]) return { success: false, error: 1 };
  if (gameState.gameState.liveInformation.state != "preparing")
    return { success: false, error: 1 };
  gameState.gameState.teams[team].members.push(username);
  gameState.gameState.users[username] = {};

  appendLog(`${username} ist Team ${Number(team) + 1} beigetreten.`);
  await gameState.saveGameState();
  return { success: true };
};

locationRevealLoop();
updateLocationsLoop();
