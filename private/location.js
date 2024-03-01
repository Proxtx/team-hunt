import { gameState } from "./gameState.js";
import { clients, send } from "./clients.js";

let pendingLocations = {};

const updateClientLocations = async () => {
  let p = [];
  let clientNames = Object.keys(clients);
  for (let client in clients) {
    try {
      p.push(
        (async () => {
          return await new Promise((r) => {
            send(client, "getLocation").then((v) => {
              if (v.success && v.locationSuccess) r(v.location);
              else {
                console.log(
                  "Client",
                  client,
                  "was unable to send their location"
                );
                r(null);
              }
            });
          });
        })()
      );
    } catch (e) {
      console.log(
        "Error updating client location! Client:",
        client,
        "Error:",
        e
      );
    }
  }

  await new Promise((r) => {
    Promise.all(p).then((result) => {
      pendingLocations = {};
      for (let clientIndex in result) {
        pendingLocations[clientNames[clientIndex]] = result[clientIndex];
      }
      r();
    });
  });

  if (pendingLocations) {
    for (let user in pendingLocations) {
      if (gameState.gameState.users[user] && pendingLocations[user]) {
        gameState.gameState.users[user].location = pendingLocations[user];
        gameState.gameState.users[user].locationUpdate = Date.now();
      }
    }
  }
};

export const updateLocationsLoop = async () => {
  try {
    await updateClientLocations();
  } catch (e) {
    console.log("Was unable to update client locations! Error:", e);
  }
  await gameState.saveGameState();

  setTimeout(() => updateLocationsLoop(), 10000);
};
