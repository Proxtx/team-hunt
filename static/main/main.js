import * as _ from "../lib/componentLoader.js";
import { connect } from "../lib/wsConnectionHandler.js";

await framework.ws.addModule("/main/receiver.js", "receiver");

connect();

if (navigator.wakeLock) await navigator.wakeLock.request("screen");
else
  alert(
    "Achtung die Webseite konnte deinen Bildschirm nicht in den 'WakeLock' Zustand versetzen!"
  );
