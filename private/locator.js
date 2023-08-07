import { gameState } from "./gameState.js";

export const getLocatorLocation = async () => {
  return { success: true, location: [50.937658, 6.957521] };
};

export const updateLocatorLocationLoop = async () => {
  let location;
  try {
    location = await getLocatorLocation();
  } catch (e) {
    console.log("Error getting locator location. Error:", e);
  }
  if (!location.success) console.log("Was unable to get locator location!");
  else {
    gameState.gameState.runnerInformation.locatorLocation = location.location;
    await gameState.saveGameState();
  }
  setTimeout(() => updateLocatorLocationLoop(), 15000);
};
