import { gameState } from "./receiver.js";

const timeText = document.getElementById("timeText");
const timeIndicator = document.getElementById("timeIndicator");

const getTimeData = () => {
  let caughtTimeout = Date.now() - gameState.team.team.caughtTimeout;
  let teamsTimeoutOnCapture =
    Date.now() - gameState.team.team.teamsTimeoutOnCapture;
  let regularTime = Date.now() - gameState.liveInformation.startTime;

  if (caughtTimeout && caughtTimeout < gameState.config.locationRevealInterval)
    return {
      status: "caughtTimeout",
      time:
        (gameState.config.locationRevealInterval - caughtTimeout) /
        gameState.config.locationRevealInterval,
    };
  else if (
    teamsTimeoutOnCapture &&
    teamsTimeoutOnCapture < gameState.config.teamsTimeoutOnCapture
  )
    return {
      status: "teamsTimeoutOnCapture",
      time:
        (gameState.config.teamsTimeoutOnCapture - teamsTimeoutOnCapture) /
        gameState.config.teamsTimeoutOnCapture,
    };
  else
    return {
      status: "regular",
      time:
        (gameState.config.gameDuration - regularTime) /
        gameState.config.gameDuration,
    };
};

const applyCurrentStatus = () => {
  let data = getTimeData();
  switch (data.status) {
    case "caughtTimeout":
      timeText.innerText = "Gefangen!";
      timeIndicator.style.backgroundColor = "red";
      break;
    case "teamsTimeoutOnCapture":
      timeText.innerText = "Balance Timeout";
      timeIndicator.style.backgroundColor = "red";
      break;
    case "regular":
      timeText.innerText = "Zeit";
      timeIndicator.style.backgroundColor = "white";
      break;
  }

  if (data.time > 0.5) timeText.style.color = "black";
  else timeText.style.color = "white";
};

export const updateTime = () => {
  try {
    applyCurrentStatus();
    timeIndicator.style.width = getTimeData().time * 100 + "%";
  } catch (e) {
    console.log(
      "Timeupdate failed. Probably because the gameState was not received yet.",
      e
    );
  }
};

const updateTimeLoop = () => {
  updateTime();
  setTimeout(() => updateTimeLoop(), 1000);
};

updateTimeLoop();
