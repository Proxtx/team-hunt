let connectedIndicator = document.getElementById("connectedIndicator");
if (!connectedIndicator) connectedIndicator = {};

export const connect = async () => {
  let result;
  let r;
  (async () => {
    result = await framework.ws.serve();
    r && r();
  })();
  setTimeout(() => r(), 5000);
  await new Promise((resolve) => (r = resolve));
  if (!result) {
    connectedIndicator.innerText = "Not Connected!";
    console.log("ws failed retry in 5 seconds");
    await new Promise((r) => setTimeout(r, 5000));
    connect();
    return;
  }

  console.log("connection established");
  connectedIndicator.innerText = "Connected";
  result.ws.addEventListener("close", () => {
    connectedIndicator.innerText = "Not Connected!";
    console.log("connection lost");
    connect();
  });
};
