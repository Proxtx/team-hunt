import { gameState } from "./receiver.js";
import { setLogs } from "./log.js";
import { updateMaps } from "./map.js";

export const update = () => {
  updateGameStateState();
  setLogs(gameState.liveInformation.log);
};

const initBox = document.getElementById("initBox");
const mainBox = document.getElementById("mainBox");
const endBox = document.getElementById("endBox");
const updateGameStateState = () => {
  switch (gameState.liveInformation.state) {
    case "preparing":
      initBox.style.display = "block";
      mainBox.style.display = "none";
      endBox.style.display = "none";
      updateInitBox();
      break;
    case "running":
      initBox.style.display = "none";
      mainBox.style.display = "block";
      endBox.style.display = "none";
      updateMainBox();
      break;
    case "ended":
      initBox.style.display = "none";
      mainBox.style.display = "none";
      endBox.style.display = "block";
      break;
  }
};

const initName = document.getElementById("initName");
const initTeamId = document.getElementById("initTeamId");

const updateInitBox = () => {
  initName.innerText = cookie.username;
  initTeamId.innerText = Number(gameState.team.teamId) + 1;
};

const updateMainBox = () => {
  updateMaps();
};
