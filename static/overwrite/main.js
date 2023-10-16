import * as _componentLoader from "../lib/componentLoader.js";
import * as _materialLoader from "../lib/materialLoader.js";
import { gameFlow } from "../lib/apiLoader.js";

const start = document.getElementById("startButton");
const password = document.getElementById("password");
const name = document.getElementById("name");

start.addEventListener("click", async () => {
  cookie.username = name.component.value;
  cookie.pwd = password.component.value;
  location.pathname = "/";
});
