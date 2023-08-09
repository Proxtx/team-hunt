import * as _ from "../lib/componentLoader.js";
import { connect } from "../lib/wsConnectionHandler.js";
import { meta } from "../lib/apiLoader.js";

const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
  cookie.username = "";
  cookie.password = "";
  location.reload();
});

if (!(await meta.available(cookie.pwd, cookie.username))) {
  location.pathname = "/signup";
}

await framework.ws.addModule("/main/receiver.js", "receiver");

connect();

if (navigator.wakeLock) await navigator.wakeLock.request("screen");
else
  alert(
    "Achtung die Webseite konnte deinen Bildschirm nicht in den 'WakeLock' Zustand versetzen!"
  );
