import * as _ from "../lib/componentLoader.js";
import { connect } from "../lib/wsConnectionHandler.js";

await framework.ws.addModule("/main/receiver.js", "receiver");

connect();
