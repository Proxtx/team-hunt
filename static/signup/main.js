import * as _componentLoader from "../lib/componentLoader.js";
import * as _materialLoader from "../lib/materialLoader.js";
import { gameFlow } from "../lib/apiLoader.js";

const start = document.getElementById("startButton");
const password = document.getElementById("password");
const name = document.getElementById("name");
const team = document.getElementById("team");

start.addEventListener("click", async () => {
  let result = await gameFlow.signUp(
    password.component.value,
    name.component.value,
    team.component.value
  );
  if (result.success) {
    cookie.username = name.component.value;
    cookie.pwd = password.component.value;
    location.pathname = "/";
  } else location.reload();
});
