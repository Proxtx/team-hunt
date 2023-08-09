import config from "@proxtx/config";
import { setup } from "@proxtx/framework";
import { setConfig } from "@proxtx/framework/static.js";
import { genHandler } from "./private/clients.js";
import { locatorReqHandler } from "./private/location.js";
import express from "express";

const app = express();

app.get("/setLocatorLocation/:pwd/:lat/:long", locatorReqHandler);

setConfig({
  ignoreParseHtml: ["/lib/components"],
  customScriptFileExtensions: [".html", ".route"],
  logs: false,
});

let result = await setup(app);
let combineHandler = await result.combineHandler(app.listen(config.port));
combineHandler.onCombine("receiver", genHandler("receiver"));

console.log("Server started. Port:", config.port);
