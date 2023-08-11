import * as _componentLoader from "../lib/componentLoader.js";
import * as _materialLoader from "../lib/materialLoader.js";

const password = document.getElementById("password");

password.addEventListener("change", () => {
  cookie.adminPwd = password.component.value;
});
