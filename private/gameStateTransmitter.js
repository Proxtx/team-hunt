import { gameState } from "./gameState.js";
import { clients, send } from "./clients.js";
import { compare } from "@proxtx/compare";

const sendUpdates = () => {};

export const updateUser = async (username) => {
  if (!clients[username])
    return console.log(
      `Received a game update but ${username} does not seem to be connected to the server.`
    );
  const data = getUserData(username);

  let exitCount = 0;
  let res;

  do {
    if (res)
      console.log("Was unable to send gameStateUpdate to client: ", username);
    res = await send(
      username,
      "updateGameState",
      compare(
        res ? "" : JSON.stringify(clients[username].gameState),
        JSON.stringify(data)
      )
    );

    exitCount++;
  } while (exitCount < 5 && !res.transmitSuccess);

  if (res.transmitSuccess) clients[username].gameState = data;
};

const getUserData = (username) => {
  let teamId;
  for (let team in gameState.gameState.teams)
    if (gameState.gameState.teams[team].members.includes(username))
      teamId = team;
  if (!teamId) throw new Error(`${username} is in no team`);

  let data = {
    team: prepareTeamUpdate(teamId),

    config: gameState.gameState.config,

    liveInformation: gameState.gameState.liveInformation,

    teams: gameState.gameState.teams,

    possibleLocatorLocations: gameState.gameState.hunterInformation
      .locatorLocation
      ? gameState.gameState.hunterInformation.fakeLocations.concat(
          gameState.gameState.hunterInformation.locatorLocation
        )
      : gameState.gameState.hunterInformation.fakeLocations,
  };

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
