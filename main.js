import config from "@proxtx/config";
import { listen } from "@proxtx/framework";
import { setConfig } from "@proxtx/framework/static.js";
import { genHandler } from "./private/clients.js";

setConfig({
  ignoreParseHtml: ["/lib/components"],
  customScriptFileExtensions: [".html", ".route"],
  logs: false,
});

let result = await listen(config.port);
let combineHandler = await result.combineHandler(result.server);
combineHandler.onCombine("receiver", genHandler("receiver"));
console.log("Server started. Port:", config.port);
