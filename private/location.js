import { gameState } from "./gameState.js";
import { clients, send } from "./clients.js";
import { auth } from "../public/admin/meta.js";
import { Life360 } from "./locatorLocation.js";
import config from "@proxtx/config";

let lastLocatorLocation = {};
let lastId = 0;

let life360 = new Life360(
  config.life360.url,
  config.life360.email,
  config.life360.password
);

let locatorUserOverwrite = null;

export const setLocatorUserOverwrite = (username) => {
  locatorUserOverwrite = username;
};

export const getLocatorUserOverwrite = () => {
  return locatorUserOverwrite;
};

await life360.init();

export const getLocatorLocation = async () => {
  if (locatorUserOverwrite && gameState.gameState.users[locatorUserOverwrite]) {
    lastLocatorLocation.location =
      gameState.gameState.users[locatorUserOverwrite].location;
    lastLocatorLocation.id =
      gameState.gameState.users[locatorUserOverwrite].locationUpdate;
  } else if (lastLocatorLocation.id == lastId) {
    await new Promise(async (r) => {
      setTimeout(r, 5000);
      try {
        await updateLocatorLocation();
      } catch (e) {
        console.log(
          "An error occurred while updating the locator position through life360. Error:",
          e
        );
      }
    });
  }
  if (lastId == lastLocatorLocation.id || !lastLocatorLocation)
    console.log("Locator Location has not been updated!");
  else lastId = lastLocatorLocation.id;
  return {
    success: true,
    location: lastLocatorLocation.location ||
      gameState.gameState.runnerInformation.locatorLocation || [0, 0],
  };
};

const updateLocatorLocation = async () => {
  let location = await life360.getMemberPosition(
    config.life360.circleId,
    config.life360.memberId
  );
  lastLocatorLocation = {
    location: [location.latitude, location.longitude],
    id: location.timestamp,
  };
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
            setTimeout(r, 4000);
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
        gameState.gameState.users[user].locationUpdate = Date.now();
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

  setTimeout(() => updateLocationsLoop(), 10000);
};
