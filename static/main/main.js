import * as _ from "../lib/componentLoader.js";
import { connect } from "../lib/wsConnectionHandler.js";

const miniMap = document.getElementById("miniMap");
const bigMap = document.getElementById("bigMap");

await uiBuilder.ready(miniMap);
await uiBuilder.ready(bigMap);

await miniMap.component.init();

bigMap.component.mapElem.style.height = "600px";
await bigMap.component.init();

await framework.ws.addModule("/main/receiver.js", "receiver");

connect();
