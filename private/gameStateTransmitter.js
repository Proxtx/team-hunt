import { gameState } from "./gameState.js";
import { clients, send } from "./clients.js";
import { compare } from "@proxtx/compare";
import { hash } from "../static/lib/hash.js";

let gameStateHashes = [];

const sendUpdates = () => {
  for (let client in clients) updateUser(client);
};

const getFittingGameState = (searchHash) => {
  for (let gameState of gameStateHashes) {
    if (hash(gameState) == searchHash) return gameState;
  }

  return "";
};

const appendGameState = (gameState) => {
  gameStateHashes.push(gameState);
  if (gameStateHashes.length > 100) gameStateHashes.shift();
};

export const updateUser = async (username) => {
  if (!clients[username])
    return console.log(
      `Received a game update but ${username} does not seem to be connected to the server.`
    );

  /*if (clients[username].updating) {
    console.log(
      "Did not update user because an update is currently happening."
    );
  }

  clients[username].updating = true;*/

  try {
    const data = JSON.stringify(getUserData(username));

    let exitCount = 0;
    let res;

    do {
      if (res)
        console.log("Was unable to send gameStateUpdate to client: ", username);

      let clientHash = await send(username, "getGameStateHash");
      if (data == getFittingGameState(clientHash)) return;

      res = await send(
        username,
        "updateGameState",
        compare(res ? "" : getFittingGameState(clientHash.hash), data)
      );

      exitCount++;
    } while (exitCount < 5 && !res.transmitSuccess);

    if (res.transmitSuccess) appendGameState(data);
  } catch (e) {
    console.log(
      "An error happened while updating a clients gameState. Username:",
      username,
      "Error:",
      e
    );
  }

  //if (clients[username]) clients[username].updating = false;
};

const getUserData = (username) => {
  let teamId;
  for (let team in gameState.gameState.teams)
    if (gameState.gameState.teams[team].members.includes(username))
      teamId = team;
  if (!teamId) throw new Error(`${username} is in no team`);

  let parsedTeamData = prepareTeamUpdate(teamId);

  let data = {
    team: parsedTeamData,

    config: gameState.gameState.config,

    liveInformation: gameState.gameState.liveInformation,

    teams: gameState.gameState.teams,

    possibleLocatorLocations: gameState.gameState.runnerInformation
      .publicLocatorLocation
      ? gameState.gameState.runnerInformation.fakeLocations.concat(
          gameState.gameState.runnerInformation.publicLocatorLocation
        )
      : gameState.gameState.runnerInformation.fakeLocations,
  };

  if (parsedTeamData.team.role == "runner")
    data.runnerInformation = gameState.gameState.runnerInformation;

  return data;
};

const prepareTeamUpdate = (team) => {
  let teamData = {
    members: {},
    teamId: team,
    team: gameState.gameState.teams[team],
  };
  for (let member of gameState.gameState.teams[team].members) {
    teamData.members[member] = gameState.gameState.users[member];
  }

  return teamData;
};

gameState.updateListeners.push(sendUpdates);
