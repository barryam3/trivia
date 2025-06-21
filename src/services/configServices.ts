const CONFIG_KEY = "global/config";

interface Config {
  pinMappings: number[];
}

const DEFAULT_CONFIG = {
  pinMappings: [38, 40, 42, 44, 46, 48, 50, 39, 41, 43, 45, 47, 49, 51],
};

function setConfig(config: Config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

function getConfig(): Config {
  return {
    ...DEFAULT_CONFIG,
    ...JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}"),
  };
}

const configServices = {
  setConfig,
  getConfig,
};

export default configServices;
