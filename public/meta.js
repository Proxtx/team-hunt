import config from "@proxtx/config";
import { send } from "../private/clients.js";
import { gameState } from "../private/gameState.js";

export const auth = (pwd) => {
  return pwd == config.pwd;
};

export const checkConnection = async (pwd, username) => {
  if (!auth(pwd)) return;
  return await send(username, "confirmConnection");
};

export const available = async (pwd, username) => {
  if (auth(pwd) && gameState.gameState.users[username]) return true;
  return false;
};
