window.lastRotationUpdate = 0;

export const getLocation = async () => {
  try {
    let location = await new Promise((r) =>
      navigator.geolocation.getCurrentPosition(r, r)
    );
  } catch {
    alert("Location fetch error!");
  }

  window.lastLocationUpdate = location;

  return location;
};

// TODO: Test this

const startCompass = async () => {
  if (DeviceOrientationEvent?.requestPermission) {
    try {
      let res = await DeviceOrientationEvent.requestPermission();
      if (res != "granted") {
        alert(
          "Device orientation service denied! This will disable the rotation on the map!"
        );
      }
    } catch (e) {
      console.log("Error asking for device orientation permission!", e);
    }
  }

  window.addEventListener(
    "deviceorientation",
    deviceOrientationEventHandler,
    true
  );
  window.addEventListener(
    "deviceorientationabsolute",
    deviceOrientationEventHandler,
    true
  );
};

const deviceOrientationEventHandler = (e) => {
  let direction = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  window.lastRotationUpdate = direction;
};

document.addEventListener("click", startCompass, { once: true });
