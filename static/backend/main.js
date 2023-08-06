import * as _componentLoader from "../lib/componentLoader.js";
import * as _materialLoader from "../lib/materialLoader.js";

const backendApi = await framework.load("admin/backend.js");

const currentGameState = (await backendApi.getCurrentGameState(cookie.adminPwd))
  .gameState;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const fakeLocationAmount = document.getElementById("fakeLocationAmount");

await uiBuilder.ready(fakeLocationAmount);

fakeLocationAmount.component.value = currentGameState.config.fakeLocationAmount;

startButton.addEventListener("click", async () => {
  await backendApi.startGame(cookie.adminPwd);
  location.reload();
});

stopButton.addEventListener("click", async () => {
  await backendApi.stopGame(cookie.adminPwd);
  location.reload();
});

fakeLocationAmount.addEventListener("change", () => {
  backendApi.updateConfig(
    cookie.adminPwd,
    "fakeLocationAmount",
    Number(fakeLocationAmount.component.value)
  );
});
