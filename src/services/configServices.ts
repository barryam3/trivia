const CONFIG_KEY = "global/config";

interface Config {
  /*
   * The pin mappings are the pins on the Arduino that are connected to the
   * buzzer system. pinMappings[i] is the pin on the Arduino that is connected
   * to the i-th contestant's buzzer.
   */
  pinMappings: number[];
}

const DEFAULT_CONFIG = {
  /**
   * The default pin mappings for the buzzer system. These are the pins the
   * author uses on an Arduino Mega.
   */
  pinMappings: [38, 40, 42, 44, 46, 48, 50, 52, 39, 41, 43, 45, 47, 49, 51, 53],
};

function setConfig(config: Config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

function resetConfig() {
  localStorage.removeItem(CONFIG_KEY);
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
  resetConfig,
  DEFAULT_CONFIG,
};

export default configServices;
