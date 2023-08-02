export class Component {
  constructor(options) {
    this.document = options.shadowDom;

    this.infoIndicator = this.document.getElementById("infoIndicator");
    this.teamIndex = this.document.getElementById("teamIndex");
    this.points = this.document.getElementById("points");
    this.roleText = this.document.getElementById("roleText");
  }

  setData(data, teamIndex) {
    this.teamIndex.innerText = Number(teamIndex) + 1;
    this.roleText.innerText = data.role == "hunter" ? "Jäger" : "Läufer";
    this.points.innerText = data.points + " Punkte";
  }

  setSelf(self) {
    if (self) this.infoIndicator.innerText = "Du bist in Team";
  }
}
