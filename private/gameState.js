import fs from "fs/promises";
import config from "@proxtx/config";

const defaultGameState = {
  available: true,

  teams: [
    {
      role: "hunter",
      members: [],
      points: 0,
    },
    {
      role: "hunter",
      members: [],
      points: 0,
    },
    {
      role: "hunter",
      members: [],
      points: 0,
    },
  ],

  hunterInformation: {
    capturedLocations: {},
    fakeLocations: [],
    pendingFakeLocations: [],
    //locatorLocation
  },

  users: {},

  config: {
    fakeLocationAmount: 2,
    revealCaptures: false,
    locations: config.locations,
    advancedHistory: false,
    teamsTimeoutOnCapture: 1000 * 60 * 3,
    locationRevealInterval: 1000 * 60 * 5,
    gameDuration: 60 * 1000 * 60 * 2,
  },

  liveInformation: {
    publiclyCapturedLocations: {},
    state: "preparing",
    log: [
      {
        time: Date.now(),
        text: "Server start",
      },
    ],
    //lastLocationReveal
  },
};

class GameState {
  updateListeners = [];

  constructor() {}

  async init() {
    this.gameState = JSON.parse(await fs.readFile("gameState.json", "utf8"));
    if (!this.gameState.available) {
      await this.overwriteGameState(
        JSON.parse(JSON.stringify(defaultGameState))
      );
    }
  }

  async overwriteGameState(newState) {
    this.gameState = newState;
    await this.saveGameState();
  }

  async saveGameState() {
    for (let listener of this.updateListeners) listener();

    await fs.writeFile(
      "gameState.json",
      JSON.stringify(this.gameState, null, 2)
    );

    if (this.gameState.config.advancedHistory)
      fs.writeFile(
        "history/" + Date.now() + ".json",
        JSON.stringify(this.gameState, null, 2)
      );
  }
}

export const gameState = new GameState();
await gameState.init();
