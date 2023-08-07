const locationMarkerImage = document.createElement("img");
locationMarkerImage.src = "/lib/images/locationMarkerImage.svg";

const possibleLocationHunterImage = document.createElement("img");
possibleLocationHunterImage.src = "/lib/images/circle.svg";
possibleLocationHunterImage.style.width = "15px";

const possibleLocationRunnerImage = document.createElement("img");
possibleLocationRunnerImage.src = "/lib/images/circleOutline.svg";
possibleLocationRunnerImage.style.width = "15px";

const actualLocatorLocationRunner = document.createElement("img");
actualLocatorLocationRunner.src = "/lib/images/locatorLocation.svg";
actualLocatorLocationRunner.style.width = "15px";

const fakeLocationRunner = document.createElement("img");
fakeLocationRunner.src = "/lib/images/fakeLocation.svg";
fakeLocationRunner.style.width = "15px";

const objectObjects = {
  locationMarker: {
    anchor: "center",
    color: "white",
    element: locationMarkerImage,
    rotationAlignment: "map",
    scale: 2,
    popUp: '<t-location-pop-up name="$LOCATION_NAME"></t-location-pop-up>',
  },

  possibleLocationHunter: {
    anchor: "center",
    color: "#2d2aff",
    element: possibleLocationHunterImage,
    rotationAlignment: "map",
    scale: 2,
    popUp: "<h3>Mögliche Locator Location.</h3>",
  },

  possibleLocationRunner: {
    anchor: "center",
    color: "#2d2aff",
    element: possibleLocationRunnerImage,
    rotationAlignment: "map",
    scale: 4,
    popUp: "<h3>Mögliche Locator Location für die Jäger</h3>",
  },

  actualLocatorLocationRunner: {
    anchor: "center",
    color: "blue",
    element: actualLocatorLocationRunner,
    rotationAlignment: "map",
    scale: 2,
    popUp: "<h3>Locator Location</h3>",
  },

  fakeLocationRunner: {
    anchor: "center",
    element: fakeLocationRunner,
    rotationAlignment: "map",
    scale: 2,
    popUp: "<h3>Fake Location $INDEX</h3>",
  },
};

export class Component {
  currentMarkers = [];
  lastAvailableLocations = [];
  oneTimeClickListeners = [];

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

    this.map.on("click", (e) => {
      for (let listener of this.oneTimeClickListeners) {
        listener([e.lngLat.lat, e.lngLat.lng]);
      }

      this.oneTimeClickListeners = [];
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
    this.updateLocatorMarkers(gameState);
  }

  updateLocatorMarkers(gameState) {
    for (let location of gameState.possibleLocatorLocations) {
      location = [...location];
      let cfg = {
        ...(gameState.team.team.role == "hunter"
          ? objectObjects.possibleLocationHunter
          : objectObjects.possibleLocationRunner),
      };
      cfg.element = cfg.element.cloneNode();
      let marker = new mapboxgl.Marker(cfg)
        .setLngLat(location.reverse().map((v) => Number(v)))
        .setPopup(new mapboxgl.Popup().setHTML(cfg.popUp));
      this.addMarker(marker);
    }

    if (gameState.team.team.role == "runner") {
      {
        let cfg = { ...objectObjects.actualLocatorLocationRunner };
        let location = [...gameState.runnerInformation.locatorLocation];
        cfg.element = cfg.element.cloneNode();
        let marker = new mapboxgl.Marker(cfg)
          .setLngLat(location.reverse().map((v) => Number(v)))
          .setPopup(new mapboxgl.Popup().setHTML(cfg.popUp));
        this.addMarker(marker);

        for (let locationIndex in gameState.runnerInformation
          .pendingFakeLocations) {
          let cfg = { ...objectObjects.fakeLocationRunner };
          location = [
            ...gameState.runnerInformation.pendingFakeLocations[locationIndex],
          ];
          cfg.element = cfg.element.cloneNode();
          let marker = new mapboxgl.Marker(cfg)
            .setLngLat(location.reverse().map((v) => Number(v)))
            .setPopup(
              new mapboxgl.Popup().setHTML(
                cfg.popUp.replace("$INDEX", Number(locationIndex) + 1)
              )
            );
          this.addMarker(marker);
        }
      }
    }
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
