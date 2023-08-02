import { gameState } from "./receiver.js";

export const renderTeams = async (elem) => {
  if (elem.children.length != gameState.teams.length) elem.innerHTML = "";

  while (elem.children.length < gameState.teams.length) {
    let status = document.createElement("t-team-status");
    await uiBuilder.ready(status);
    elem.appendChild(status);
  }

  for (let team in gameState.teams) {
    elem.children[team].component.setData(gameState.teams[team], team);
  }

  elem.children[gameState.team.teamId].component.setSelf(true);
};
