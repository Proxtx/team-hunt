import { gameState } from "/main/receiver.js";
import { gameFlow } from "../../apiLoader.js";

export class Component {
  constructor(options) {
    this.document = options.shadowDom;
    this.image = this.document.getElementById("image");
    this.button = this.document.getElementById("button");

    this.button.addEventListener("click", () => {
      if (
        confirm(
          "Bist du sicher dass du diesen Punkt sammeln kannst? Hast du den Locator? Hast du ein Foto gemacht?"
        )
      )
        gameFlow.collectLocation(cookie.pwd, cookie.username, this.name);
    });
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    switch (attribute) {
      case "name":
        this.setName(newValue);
        break;
    }
  }

  setName(name) {
    this.name = name;
    this.image.src = "/cdn/" + name;
    if (gameState.team.team.role == "runner") {
      this.button.style.display = "block";
    }
  }
}
