const locationMarkerImage = document.createElement("img");
locationMarkerImage.src = "/lib/images/locationMarkerImage.svg";

const objectObjects = {
  locationMarker: {
    anchor: "center",
    color: "white",
    element: locationMarkerImage,
    rotationAlignment: "map",
    scale: 2,
    popUp: '<t-location-pop-up name="$LOCATION_NAME"></t-location-pop-up>',
  },
};

export class Component {
  currentMarkers = [];
  lastAvailableLocations = [];

  constructor(options) {
    this.document = options.shadowDom;
    this.mapElem = this.document.getElementById("map");
  }

  async init() {
    while (!window.mapboxgl) {
      console.log("Map API not available. Waiting.");
      await new Promise((r) => setTimeout(r, 10));
    }
    mapboxgl.accessToken =
      "pk.eyJ1IjoicHJveHR4IiwiYSI6ImNsNXF5dm9mZTBpdTgzanA4bXAxZGxqajIifQ.ardzxffHpMXyhvSjlC-gAw"; //TODO: fetch from config
    this.map = new mapboxgl.Map({
      container: this.mapElem,
      style: "mapbox://styles/proxtx/clkoc742t00lw01pcfykfadqc/draft",
      center: [6.958811, 50.93591], // TODO: fetch from server
      zoom: 12.8, // TODO: fetch from server
    });
  }

  clearAllMarkers() {
    for (let marker of this.currentMarkers) {
      marker.remove();
    }
  }

  addMarker(marker) {
    marker.addTo(this.map);
    this.currentMarkers.push(marker);
  }

  updateMap(gameState) {
    this.clearAllMarkers();

    this.updateLocationMarkers(gameState);
  }

  updateLocationMarkers(gameState) {
    let availableLocations = gameState.config.locations.filter((value) => {
      if (
        gameState.liveInformation.publiclyCapturedLocations.includes(value.name)
      )
        return false;
      else if (
        gameState.runnerInformation?.capturedLocations.includes(value.name)
      )
        return false;
      return true;
    });

    this.lastAvailableLocations = availableLocations;

    for (let location of availableLocations) {
      let cfg = { ...objectObjects.locationMarker };
      cfg.element = cfg.element.cloneNode();
      let marker = new mapboxgl.Marker(cfg)
        .setLngLat(
          location.location
            .split(" ")
            .reverse()
            .map((v) => Number(v))
        )
        .setPopup(
          new mapboxgl.Popup().setHTML(
            cfg.popUp.replace("$LOCATION_NAME", location.name)
          )
        );
      this.addMarker(marker);
    }
  }
}
