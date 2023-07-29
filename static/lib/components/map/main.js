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
      "pk.eyJ1IjoicHJveHR4IiwiYSI6ImNsNXF5dm9mZTBpdTgzanA4bXAxZGxqajIifQ.ardzxffHpMXyhvSjlC-gAw";
    this.map = new mapboxgl.Map({
      container: this.mapElem, // container ID
      style: "mapbox://styles/proxtx/clkoc742t00lw01pcfykfadqc/draft", // style URL
      center: [6.958811, 50.93591], // starting position [lng, lat]
      zoom: 12.8, // starting zoom
    });
  }
}
