import { gameState } from "./gameState.js";
import { auth } from "../public/meta.js";
import { updateUser } from "./gameStateTransmitter.js";

export let clients = {};

export const genHandler = (type) => {
  return async (module) => {
    try {
      if (await auth(await module.pwd)) {
        if (type == "receiver") {
          let username = await module.username;
          if (gameState.gameState.users[username]) {
            clients[username] = {
              module,
              gameState: await module.gameState,
            };
            updateUser(username);
          } else console.log("Client with unknown username.");
        }
      } else console.log("Combine auth error");
    } catch (e) {
      console.log("Combine WS Error!\n", e);
    }
  };
};

export const send = async (user, method, ...args) => {
  if (!clients[user]) return;
  try {
    let result = await clients[user].module[method](...args);
    if (!result || !result.success) delete clients[user];
    return result;
  } catch (e) {
    console.log("Combine send error.", e);
  }
};
