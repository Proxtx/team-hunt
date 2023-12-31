import { gameState } from "../private/gameState.js";
import { auth } from "./meta.js";
import {
  fakeLocation,
  changeRunner,
  claimLocation,
  createUser,
} from "../private/gameFlow.js";

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

export const caught = async (pwd, username, index) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  if (
    getTeam(username).role != "runner" ||
    gameState.gameState.teams[index]?.role != "hunter"
  )
    return { success: false, error: 1 };
  return await changeRunner(index);
};

export const collectLocation = async (pwd, username, location) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  if (getTeam(username).role != "runner") return { success: false, error: 1 };
  return await claimLocation(location);
};

export const signUp = async (pwd, username, team) => {
  if (!auth(pwd)) return { success: false, error: 1 };
  return await createUser(username, team);
};
