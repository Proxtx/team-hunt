import config from "@proxtx/config";
import { listen } from "@proxtx/framework";
import { setConfig } from "@proxtx/framework/static.js";

setConfig({
  ignoreParseHtml: ["/lib/components"],
  customScriptFileExtensions: [".html", ".route"],
});

listen(config.port);
console.log("Server started. Port:", config.port);
