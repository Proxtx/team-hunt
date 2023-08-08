import { gameFlow } from "../lib/apiLoader.js";

const catchTextWrap = document.getElementById("catchTextWrap");
const catchText = document.getElementById("catchText");
const mainTeamsWrap = document.getElementById("mainTeamsWrap");

let originalCatchText = catchText.innerText;

let selecting = false;

let listeners = [];

catchTextWrap.addEventListener("click", () => {
  if (selecting) {
    catchText.innerText = originalCatchText;
    return (selecting = false);
  }
  clearListeners();
  selecting = true;
  catchText.innerText =
    "Klicke jetzt auf das entsprechende Jäger team. Klicke hier um dem Prozess abzubrechen.";

  for (
    let childIndex = 0;
    childIndex < mainTeamsWrap.children.length;
    childIndex++
  ) {
    mainTeamsWrap.children[childIndex].addEventListener(
      "click",
      eventListener.bind({ childIndex })
    );
  }
});

let eventListener = function () {
  if (
    selecting &&
    confirm(
      "Bist du dir sicher, dass du von Team " +
        (Number(this.childIndex) + 1) +
        " gefangen wurdest und den Locator hast?"
    )
  ) {
    gameFlow.caught(cookie.pwd, cookie.username, this.childIndex);
  }

  selecting = false;
  catchText.innerText = originalCatchText;
};

const clearListeners = () => {
  for (
    let childIndex = 0;
    childIndex < mainTeamsWrap.children.length;
    childIndex++
  ) {
    mainTeamsWrap.children[childIndex].removeEventListener(
      "click",
      eventListener
    );
  }
};
