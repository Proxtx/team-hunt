import { gameState } from "./receiver.js";
import { setLogs } from "./log.js";
import { updateMaps } from "./map.js";
import { updateTime } from "./time.js";
import { renderTeams } from "./teams.js";

export const update = () => {
  updateTime();
  updateGameStateState();
  setLogs(gameState.liveInformation.log);
};

const initBox = document.getElementById("initBox");
const mainBox = document.getElementById("mainBox");
const endBox = document.getElementById("endBox");

const mainTeamsWrap = document.getElementById("mainTeamsWrap");
const endTeamsWrap = document.getElementById("endTeamsWrap");

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
      renderTeams(mainTeamsWrap);
      break;
    case "ended":
      initBox.style.display = "none";
      mainBox.style.display = "none";
      endBox.style.display = "block";
      renderTeams(endTeamsWrap);
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
