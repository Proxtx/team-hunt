import * as _ from "../lib/componentLoader.js";

const miniMap = document.getElementById("miniMap");

await uiBuilder.ready(miniMap);

//miniMap.component.map.style.height = "100px";
await miniMap.component.init();
