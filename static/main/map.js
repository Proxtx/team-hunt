import { gameState } from "./receiver.js";

const downArrowsInnerWrap = document.getElementById("downArrowsInnerWrap");
const upArrowsInnerWrap = document.getElementById("upArrowsInnerWrap");
const miniMapWrap = document.getElementById("miniMapWrap");
const bigMapWrap = document.getElementById("bigMapWrap");
const miniMap = document.getElementById("miniMap");
const bigMap = document.getElementById("bigMap");

await uiBuilder.ready(miniMap);
await uiBuilder.ready(bigMap);

bigMap.component.mapElem.style.height = "600px";

await miniMap.component.init();
await bigMap.component.init();

bigMapWrap.style.display = "none";

downArrowsInnerWrap.addEventListener("click", () => {
  miniMapWrap.style.display = "none";
  bigMapWrap.style.display = "block";
  bigMap.component.map.resize();
});

upArrowsInnerWrap.addEventListener("click", () => {
  miniMapWrap.style.display = "block";
  bigMapWrap.style.display = "none";
});

const maps = [miniMap, bigMap];

const updateMap = (map) => {
  map.component.updateMap(gameState);
};

export const updateMaps = () => {
  for (let map of maps) {
    updateMap(map);
  }
};
