import { gameState } from "./gameState.js";
import { clients, send } from "./clients.js";
import { auth } from "../public/admin/meta.js";

let lastLocatorLocation = {};
let lastId = 0;

export const getLocatorLocation = async () => {
  if (lastId == lastLocatorLocation.id || !lastLocatorLocation)
    console.log("Locator Location has not been updated!");
  else lastId = lastLocatorLocation.id;
  return { success: true, location: lastLocatorLocation.location || [0, 0] };
};

export const locatorReqHandler = (req, res) => {
  if (auth(req.params.pwd)) {
    lastLocatorLocation = {
      id: Math.floor(Math.random() * 100000),
      location: [req.params.lat, req.params.long],
    };
  }

  res.status(200).send();
};

let pendingLocations;

const updateClientLocations = async () => {
  let p = [];
  let clientNames = Object.keys(clients);
  for (let client in clients) {
    try {
      p.push(
        (async () => {
          return await new Promise((r) => {
            setTimeout(r, 5000);
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
    setTimeout(r, 5000);
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
      }
    }
  }
};

export const updateLocationsLoop = async () => {
  let location;
  try {
    location = await getLocatorLocation();
  } catch (e) {
    console.log("Error getting locator location. Error:", e);
  }
  try {
    await updateClientLocations();
  } catch (e) {
    console.log("Was unable to update client locations! Error:", e);
  }
  if (!location.success) console.log("Was unable to get locator location!");
  else {
    gameState.gameState.runnerInformation.locatorLocation = location.location;
  }
  await gameState.saveGameState();

  setTimeout(() => updateLocationsLoop(), 15000);
};
