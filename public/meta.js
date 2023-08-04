import config from "@proxtx/config";
import { send } from "../private/clients.js";

export const auth = (pwd) => {
  return pwd == config.pwd;
};

export const checkConnection = async (pwd, username) => {
  if (!auth(pwd)) return;
  return await send(username, "confirmConnection");
};
