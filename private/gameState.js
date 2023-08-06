import fs from "fs/promises";
import config from "@proxtx/config";
import process from "process";

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

  runnerInformation: {
    capturedLocations: [],
    fakeLocations: [],
    pendingFakeLocations: [],
    //locatorLocation
    //publicLocatorLocation
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
    publiclyCapturedLocations: [],
    state: "preparing",
    log: [
      {
        time: Date.now(),
        text: "Server start",
      },
    ],
    //lastLocationReveal
    //startTime
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
    if (this.saving) return;
    this.saving = true;

    try {
      try {
        for (let listener of this.updateListeners) listener();
      } catch (e) {
        console.log(
          "En error happened while updating an 'saveGameState' listener! Error:",
          e
        );
      }

      await fs.writeFile(
        "gameState.json",
        JSON.stringify(this.gameState, null, 2)
      );

      if (this.gameState.config.advancedHistory)
        fs.writeFile(
          "history/" + Date.now() + ".json",
          JSON.stringify(this.gameState, null, 2)
        );
    } catch (e) {
      console.log(
        "An error happened while saving the updated gameState! Stopping the server! Error:",
        e
      );

      process.exit();
    }

    this.saving = false;
  }
}

export const gameState = new GameState();
await gameState.init();
