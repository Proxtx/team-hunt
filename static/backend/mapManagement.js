const backendApi = await framework.load("admin/backend.js");

const map = document.getElementById("map");

await uiBuilder.ready(map);

map.component.mapElem.style.height = "500px";

await map.component.init();

const updateMap = async () => {
  const currentGameState = (
    await backendApi.getCurrentGameState(cookie.adminPwd)
  ).gameState;

  map.component.updateMap(
    {
      ...currentGameState,
      possibleLocatorLocations: [
        currentGameState.runnerInformation.locatorLocation,
        ...currentGameState.runnerInformation.fakeLocations,
      ],
      team: { members: currentGameState.users, team: { role: "runner" } },
    },
    false
  );
};

const updateMapLoop = async () => {
  try {
    await updateMap();
  } catch (e) {
    alert("Fehler beim Aktualisieren der Karte:", e);
  }

  setTimeout(() => updateMapLoop(), 15000);
};

updateMapLoop();
