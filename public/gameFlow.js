import { gameState } from "../private/gameState.js";
import { auth } from "./meta.js";
import { fakeLocation } from "../private/gameFlow.js";

export const placeFakeLocation = async (pwd, username, index, location) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  if (getTeam(username).role != "runner") return { success: false, error: 1 };
  await fakeLocation(index, location);
};

const getTeam = (username) => {
  for (let team of gameState.gameState.teams) {
    if (team.members.includes(username)) {
      return team;
    }
  }
};
