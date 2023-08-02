export const updateMaps = () => {};

const downArrowsInnerWrap = document.getElementById("downArrowsInnerWrap");
const upArrowsInnerWrap = document.getElementById("upArrowsInnerWrap");
const miniMapWrap = document.getElementById("miniMapWrap");
const bigMapWrap = document.getElementById("bigMapWrap");

bigMapWrap.style.display = "none";

downArrowsInnerWrap.addEventListener("click", () => {
  miniMapWrap.style.display = "none";
  bigMapWrap.style.display = "block";
});

upArrowsInnerWrap.addEventListener("click", () => {
  miniMapWrap.style.display = "block";
  bigMapWrap.style.display = "none";
});

const maps = [
  document.getElementById("miniMap"),
  document.getElementById("bigMap"),
];

const updateMap = (map) => {};
