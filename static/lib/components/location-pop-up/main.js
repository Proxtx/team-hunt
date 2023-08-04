import { gameState } from "/main/receiver.js";

export class Component {
  constructor(options) {
    this.document = options.shadowDom;
    this.image = this.document.getElementById("image");
    this.button = this.document.getElementById("button");
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
