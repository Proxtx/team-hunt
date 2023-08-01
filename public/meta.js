import config from "@proxtx/config";

export const auth = (pwd) => {
  return pwd == config.pwd;
};
