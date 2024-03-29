import { meta } from "/lib/apiLoader.js";

const vars = (await meta.mapVars(cookie.pwd)).vars;

const locationMarkerImage = document.createElement("img");
locationMarkerImage.src = "/lib/images/locationMarkerImage.svg";
locationMarkerImage.style.width = "20px";

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

const playerImage = document.createElement("img");
playerImage.src = "/lib/images/player.svg";
playerImage.style.width = "18px";

const liveLocationImageWrapper = document.createElement("div");

const liveLocationImage = document.createElement("img");
liveLocationImage.src = "/lib/images/liveLocation.png";
liveLocationImage.style.width = "18px";
liveLocationImageWrapper.appendChild(liveLocationImage);

const objectObjects = {
  locationMarker: {
    anchor: "center",
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

  player: {
    anchor: "center",
    element: playerImage,
    rotationAlignment: "map",
    scale: 2,
    popUp: "<h3>$NAME</h3>",
  },

  liveLocation: {
    anchor: "center",
    element: liveLocationImageWrapper,
    rotationAlignment: "viewport",
    scale: 2,
    popUp: "<h3>Du</h3>",
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

  setLiveLocationDisplay(enabled, username) {
    this.liveLocationEnabled = enabled;
    this.ownUsername = username;
  }

  async init() {
    while (!window.mapboxgl) {
      console.log("Map API not available. Waiting.");
      await new Promise((r) => setTimeout(r, 10));
    }
    mapboxgl.accessToken = vars.accessToken;
    this.map = new mapboxgl.Map({
      container: this.mapElem,
      style: "mapbox://styles/proxtx/clt4j5ksl000001qph3it37wx",
      center: vars.center,
      zoom: vars.zoom,
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

  updateMap(gameState, addLocationPopUps = true) {
    this.clearAllMarkers();

    this.updateLocationMarkers(gameState, addLocationPopUps);
    this.updateLocatorMarkers(gameState);
    this.updateTeamLocation(gameState);
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

  updateLocationMarkers(gameState, addPopUps = true) {
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
      let marker = new mapboxgl.Marker(cfg).setLngLat(
        location.location
          .split(" ")
          .reverse()
          .map((v) => Number(v))
      );
      if (addPopUps)
        marker.setPopup(
          new mapboxgl.Popup().setHTML(
            cfg.popUp.replace("$LOCATION_NAME", location.name)
          )
        );
      this.addMarker(marker);
    }
  }

  updateTeamLocation(gameState) {
    let liveLocationResult = false;

    if (this.liveLocationEnabled) {
      try {
        liveLocationResult = this.setLiveLocation();
      } catch (e) {
        alert("Error displaying your location! " + e);
      }
    }

    for (let member in gameState.team.members) {
      if (
        !gameState.team.members[member].location ||
        (liveLocationResult && this.ownUsername == member)
      )
        continue;
      let cfg = { ...objectObjects.player };
      cfg.element = cfg.element.cloneNode();
      let location = [...gameState.team.members[member].location];
      let marker = new mapboxgl.Marker(cfg)
        .setLngLat(location.reverse().map((v) => Number(v)))
        .setPopup(
          new mapboxgl.Popup().setHTML(cfg.popUp.replace("$NAME", member))
        );
      this.addMarker(marker);
    }
  }

  setLiveLocation() {
    let location = window.lastLocationUpdate;
    let rotation = window.lastRotationUpdate;

    if (!location || !location.coords) return false;

    let cfg = { ...objectObjects.liveLocation };
    cfg.element = cfg.element.cloneNode(true);
    cfg.element.children[0].style.transform = "rotate(" + rotation + "deg)";
    let marker = new mapboxgl.Marker(cfg)
      .setLngLat(
        [location.coords.longitude, location.coords.latitude].map((v) =>
          Number(v)
        )
      )
      .setPopup(new mapboxgl.Popup().setHTML(cfg.popUp));
    this.addMarker(marker);

    return true;
  }
}
