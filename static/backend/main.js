import * as _componentLoader from "../lib/componentLoader.js";
import * as _materialLoader from "../lib/materialLoader.js";
import * as _mapManagement from "./mapManagement.js";

const backendApi = await framework.load("admin/backend.js");

const currentGameState = (await backendApi.getCurrentGameState(cookie.adminPwd))
  .gameState;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const fakeLocationAmount = document.getElementById("fakeLocationAmount");
const revealCaptures = document.getElementById("revealCaptures");
const advancedHistory = document.getElementById("advancedHistory");
const teamsTimeoutOnCapture = document.getElementById("teamsTimeoutOnCapture");
const userOverwrite = document.getElementById("userOverwrite");
const logMessage = document.getElementById("logMessage");
const locationRevealInterval = document.getElementById(
  "locationRevealInterval"
);

await uiBuilder.ready(fakeLocationAmount);
await uiBuilder.ready(revealCaptures);
await uiBuilder.ready(advancedHistory);
await uiBuilder.ready(teamsTimeoutOnCapture);
await uiBuilder.ready(locationRevealInterval);

fakeLocationAmount.component.value = currentGameState.config.fakeLocationAmount;
revealCaptures.component.checked = currentGameState.config.revealCaptures;
advancedHistory.component.checked = currentGameState.config.advancedHistory;
teamsTimeoutOnCapture.component.value =
  currentGameState.config.teamsTimeoutOnCapture;
locationRevealInterval.component.value =
  currentGameState.config.locationRevealInterval;

startButton.addEventListener("click", async () => {
  await backendApi.startGame(cookie.adminPwd);
  location.reload();
});

stopButton.addEventListener("click", async () => {
  await backendApi.stopGame(cookie.adminPwd);
  location.reload();
});

resetButton.addEventListener("click", async () => {
  await backendApi.resetGame(cookie.adminPwd);
  location.reload();
});

fakeLocationAmount.addEventListener("change", () => {
  backendApi.updateConfig(
    cookie.adminPwd,
    "fakeLocationAmount",
    Number(fakeLocationAmount.component.value)
  );
});

revealCaptures.addEventListener("change", () => {
  backendApi.updateConfig(
    cookie.adminPwd,
    "revealCaptures",
    revealCaptures.component.checked
  );
});

advancedHistory.addEventListener("change", () => {
  backendApi.updateConfig(
    cookie.adminPwd,
    "advancedHistory",
    advancedHistory.component.checked
  );
});

teamsTimeoutOnCapture.addEventListener("change", () => {
  backendApi.updateConfig(
    cookie.adminPwd,
    "teamsTimeoutOnCapture",
    Number(teamsTimeoutOnCapture.component.value)
  );
});

locationRevealInterval.addEventListener("change", () => {
  backendApi.updateConfig(
    cookie.adminPwd,
    "locationRevealInterval",
    Number(locationRevealInterval.component.value)
  );
});

logMessage.addEventListener("change", () => {
  backendApi.appendCustomLog(cookie.adminPwd, logMessage.component.value);
});

const applyOptionArray = async (elem, options) => {
  elem.innerHTML = "";
  for (let option of options) {
    let oElem = document.createElement("option");
    oElem.innerText = option;
    oElem.value = option;
    elem.appendChild(oElem);
  }
};

const users = await backendApi.getUsers(cookie.adminPwd);

users.users = ["--"].concat(users.users);

applyOptionArray(userOverwrite, users.users);

userOverwrite.addEventListener("change", async () => {
  await backendApi.setUserOverwrite(cookie.adminPwd, userOverwrite.value);
});
