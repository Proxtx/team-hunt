export class Component {
  constructor(options) {
    this.document = options.shadowDom;
    this.mapElem = this.document.getElementById("map");
  }

  async init() {
    while (!window.mapboxgl) {
      console.log("Map API not available. Waiting.");
      await new Promise((r) => setTimeout(r, 10));
    }
    console.log("Map API available");

    mapboxgl.accessToken =
      "pk.eyJ1IjoicHJveHR4IiwiYSI6ImNsNXF5dm9mZTBpdTgzanA4bXAxZGxqajIifQ.ardzxffHpMXyhvSjlC-gAw"; //TODO: fetch from config
    this.map = new mapboxgl.Map({
      container: this.mapElem,
      style: "mapbox://styles/proxtx/clkoc742t00lw01pcfykfadqc/draft",
      center: [6.958811, 50.93591], // TODO: fetch from server
      zoom: 12.8, // TODO: fetch from server
    });
  }
}
