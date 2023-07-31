import * as _ from "../lib/componentLoader.js";

const miniMap = document.getElementById("miniMap");
const bigMap = document.getElementById("bigMap");

await uiBuilder.ready(miniMap);
await uiBuilder.ready(bigMap);

await miniMap.component.init();

bigMap.component.mapElem.style.height = "400px";
await bigMap.component.init();
