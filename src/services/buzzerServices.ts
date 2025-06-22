import type * as _ from "w3c-web-serial";
import gamesServices from "./gamesServices";
import configServices from "./configServices";
import { BehaviorSubject } from "../utils/behavior_subject";

// We track the connected state in two places: the game, for reactivity, and here, for freshness.
let connected = false;

const buzzedInContestant = new BehaviorSubject<number | undefined>(undefined);

// Matches the first single-level JSON object in a string, and the rest of the string after it.
const JSON_REGEX = /({[^}]*})(.*)/g;

async function serialListen(onValue: (value: string) => void): Promise<void> {
  if (!("serial" in navigator)) {
    throw new Error("Your browser does not support the Web Serial API.");
  }
  // Get all serial ports the user has previously granted the website access to.
  const ports = await navigator.serial.getPorts();
  // If there is not exactly one port, request a port.
  const port =
    ports.length === 1 ? ports[0] : await navigator.serial.requestPort();
  try {
    await port.open({ baudRate: 9600 });
  } catch (error) {
    // Ignore error due to port already being open. This is just for hot reload.
    if (!(error instanceof Error) || error.name !== "InvalidStateError") {
      port.forget();
      throw new Error("Serial port failed to open.");
    }
  }
  if (!port.readable) {
    port.close().finally(() => port.forget());
    throw new Error("Serial port is not readable.");
  }
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  // Listen to data coming from the serial device.
  let cumulativeValue = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      cumulativeValue += value;
      const match = JSON_REGEX.exec(cumulativeValue);
      if (match) {
        onValue(match[1]);
        cumulativeValue = match[2];
      }
      if (done) {
        break;
      }
    }
  } finally {
    await port.close();
    await readableStreamClosed;
  }
}

/** Listen for buzzes from the buzzer system. */
function listenForBuzz(gameUID: string) {
  buzzedInContestant.subscribe((contestant) => {
    // The buzzer system may reset, but buzzes in the app must be dismissed by the host.
    if (contestant == null) return;

    const game = gamesServices.getGame(gameUID);
    if (game.buzzedInContestant == null) {
      // 1st player to buzz in.
      gamesServices.setBuzz(gameUID, contestant);
    } else {
      // Subsequent players to buzz in after the buzzer system has reset but before the buzz has been dismissed in the
      // app by the host.
      gamesServices.addExtraneousBuzz(gameUID, contestant);
    }
  });
}

/** Dismiss the buzz in the UI when the buzzer system is reset. */
function dismissBuzz(gameUID: string): Promise<void> {
  if (buzzedInContestant.value == null) {
    gamesServices.setBuzz(gameUID, undefined);
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const onBuzz = (value: number | undefined) => {
      if (value != null) return;
      gamesServices.setBuzz(gameUID, undefined);
      buzzedInContestant.unsubscribe(onBuzz);
      resolve();
    };
    buzzedInContestant.subscribe(onBuzz);
  });
}

export function connect(gameUID: string) {
  if (connected) return;
  connected = true;
  gamesServices.setBuzzerConnected(gameUID, true);
  listenForBuzz(gameUID);
  serialListen((value: string) => {
    let obj: Record<string, number>;
    try {
      obj = JSON.parse(value);
    } catch (e) {
      throw new Error(`Invalid JSON: ${value}`);
    }
    const entries = Object.entries(obj);
    if (entries.length !== 1) {
      return;
    }
    const [pin, state] = entries[0];
    if (state === 0) {
      const { pinMappings } = configServices.getConfig();
      const contestant = pinMappings.indexOf(Number(pin));
      buzzedInContestant.next(contestant);
    } else if (state === 1) {
      buzzedInContestant.next(undefined);
    }
  }).finally(() => {
    buzzedInContestant.next(undefined);
    connected = false;
    gamesServices.setBuzzerConnected(gameUID, false);
  });
}

// For development without an active buzzer connection.
function fakeConnect(gameUID: string) {
  connected = true;
  gamesServices.setBuzzerConnected(gameUID, true);
  listenForBuzz(gameUID);
  document.addEventListener("keydown", (e) => {
    if ("12345678".includes(e.key)) {
      let contestant = Number(e.key) - 1;
      if (e.shiftKey) {
        contestant += 8;
      }
      buzzedInContestant.next(contestant);
      setTimeout(() => {
        buzzedInContestant.next(undefined);
      }, 3000);
    } else if (e.key === "0") {
      buzzedInContestant.next(undefined);
    }
  });
}
// Install fakeConnect on the global object.
(globalThis as { [key: string]: unknown }).fakeConnect = fakeConnect;

function useConnected(): boolean {
  const game = gamesServices.useGame();
  const leader = gamesServices.useLeader();
  // If the leader view hasn't connected, then the value in the game is stale.
  if (leader && !connected) {
    gamesServices.setBuzzerConnected(game.uid, false);
    gamesServices.setBuzz(game.uid, undefined);
  }
  return !!game.buzzerConnected;
}

export default {
  connect,
  useConnected,
  dismissBuzz,
};
