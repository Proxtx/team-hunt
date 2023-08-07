import { gameState } from "./receiver.js";

const fakeLocationButtonsWrap = document.getElementById(
  "fakeLocationButtonsWrap"
);
const bigMap = document.getElementById("bigMap");

export const updateButtons = () => {
  if (
    fakeLocationButtonsWrap.children.length !=
    gameState.config.fakeLocationAmount
  ) {
    fakeLocationButtonsWrap.innerHTML = "";
  }

  while (
    fakeLocationButtonsWrap.children.length <
    gameState.config.fakeLocationAmount
  ) {
    let button = document.createElement("button");
    fakeLocationButtonsWrap.appendChild(button);
    button.innerText =
      "Fake Location " + fakeLocationButtonsWrap.children.length;
    button.addEventListener(
      "click",
      generateEventListener(fakeLocationButtonsWrap.children.length - 1)
    );
  }
};

const generateEventListener = (buttonIndex) => {
  return () => {
    for (
      let childIndex = 0;
      childIndex < fakeLocationButtonsWrap.children.length;
      childIndex++
    ) {
      if (childIndex != buttonIndex)
        fakeLocationButtonsWrap.children[childIndex].style.opacity = 0.2;
      fakeLocationButtonsWrap.children[childIndex].style.pointerEvents = "none";
    }

    bigMap.component.oneTimeClickListeners.push((location) => {});
  };
};
