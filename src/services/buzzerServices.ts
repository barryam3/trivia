// @ts-ignore
import type * as _ from "w3c-web-serial";
import gamesServices from "./gamesServices";
import configServices from "./configServices";
import { BehaviorSubject } from "../utils/behavior_subject";
import { useEffect, useState } from "react";

// We track the connected state in two places: the game, for reactivity, and here, for freshness.
let connected = false;

const buzzedInPins = new BehaviorSubject<Set<number>>(new Set());
const buzzedInContestants = new BehaviorSubject<Set<number>>(new Set());
// buzzedInContestants is derived from buzzedInPins.
buzzedInPins.subscribe((pins) => {
  const { pinMappings } = configServices.getConfig();
  const set = new Set(Array.from(pins).map((pin) => pinMappings.indexOf(pin)));
  buzzedInContestants.next(set);
});

/**
 * Listens to the serial device and outputs new (different than previous) full
 * newline-separated values.
 */
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
    await port.open({ baudRate: 115200 });
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
  const readableStreamClosed = port.readable.pipeTo(
    // Web Serial emits Uint8Array, and TextDecoderStream accepts BufferSource,
    // which includes Uint8Array.
    textDecoder.writable as WritableStream<Uint8Array<ArrayBufferLike>>,
  );
  const reader = textDecoder.readable.getReader();
  // Listen to data coming from the serial device.
  let cumulativeValue = "";
  let prevValue: string | undefined;
  try {
    while (true) {
      const { value, done } = await reader.read();
      cumulativeValue += value;
      const match = cumulativeValue.includes("\n");
      if (match) {
        const [before, after] = cumulativeValue.split("\n", 2);
        cumulativeValue = after;
        // The device sends newline-delimited values. The value before the first
        // newline might be partial, so we discard it. The device re-sends the
        // value once per second so we discard duplicates.
        if (before !== prevValue && prevValue !== undefined) {
          onValue(before);
        }
        prevValue = before;
      }
      if (done) {
        break;
      }
    }
  } finally {
    reader.releaseLock();
    await port.close();
    await readableStreamClosed;
  }
}

/** Listen for buzzes from the buzzer system. */
function listenForBuzz(gameUID: string) {
  buzzedInContestants.subscribe((contestants) => {
    // The buzzer system may reset, but buzzes in the app must be dismissed by the host.
    if (contestants.size === 0) return;

    const game = gamesServices.getGame(gameUID);
    if (game.buzzedInContestant == null) {
      // 1st player to buzz in.
      if (contestants.size !== 1) {
        throw new Error("Multiple contestants buzzed in simultaneously.");
      }
      gamesServices.setBuzz(gameUID, Array.from(contestants)[0]);
    } else {
      // Subsequent players to buzz in after the buzzer system has reset but before the buzz has been dismissed in the
      // app by the host.
      for (const contestant of contestants) {
        if (
          game.buzzedInContestant === contestant ||
          game.extraneousBuzzedInContestants?.includes(contestant)
        ) {
          continue;
        }
        gamesServices.addExtraneousBuzz(gameUID, contestant);
      }
    }
  });
}

/** Dismiss the buzz in the UI when the buzzer system is reset. */
function dismissBuzz(gameUID: string, force = false): Promise<void> {
  // Force: don't wait for the buzzer system to reset.
  if (force) {
    buzzedInPins.next(new Set());
  }
  if (buzzedInContestants.value.size === 0) {
    gamesServices.setBuzz(gameUID, undefined);
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const onBuzz = (value: Set<number>) => {
      if (value.size > 0) return;
      gamesServices.setBuzz(gameUID, undefined);
      buzzedInContestants.unsubscribe(onBuzz);
      resolve();
    };
    buzzedInContestants.subscribe(onBuzz);
  });
}

const ACTIVE = "0" as const;
const INACTIVE = "1" as const;
type BuzzerState = typeof ACTIVE | typeof INACTIVE;

/** Wraps @see serialListen and outputs newly active & inactive pin numbers. */
function listenForChanges(
  onChangedPinStates: (changes: {
    active: number[];
    inactive: number[];
  }) => void,
): Promise<void> {
  let prevPinStates: BuzzerState[] | undefined;
  return serialListen((value: string) => {
    const pinStates = value.split("") as BuzzerState[];
    if (prevPinStates) {
      const active: number[] = [];
      const inactive: number[] = [];
      for (let i = 0; i < pinStates.length; i++) {
        if (prevPinStates[i] !== pinStates[i]) {
          if (pinStates[i] === ACTIVE) {
            active.push(i);
          }
          if (pinStates[i] === INACTIVE) {
            inactive.push(i);
          }
        }
      }
      if (active.length > 0 || inactive.length > 0) {
        onChangedPinStates({ active, inactive });
      }
    }
    prevPinStates = pinStates;
  });
}

/**
 * Connects to the serial device and begins streaming updates to
 * @see buzzedInPins.
 */
export function connect(gameUID: string): Promise<void> {
  if (connected) return Promise.resolve();
  connected = true;
  gamesServices.setBuzzerConnected(gameUID, true);
  listenForBuzz(gameUID);
  return listenForChanges(({ active, inactive }) => {
    // I think two players can't buzz in at the same time but a player could
    // buzz in immediately after the buzzer system resets, before the next
    // serial value is sent. In this case, we would need to process both (and
    // the buzz in would be invalid since buzz outs are delayed below).
    if (active.length > 0) {
      const set = new Set(buzzedInPins.value);
      for (const pin of active) {
        set.add(pin);
      }
      buzzedInPins.next(set);
    }
    if (inactive.length > 0) {
      // Delay buzz out to handle buzzer system edge case where one unit
      // resets before the other. This causes anyone who buzzes in before both
      // units have reset to come up as an invalid buzz, as there was still a
      // contestant buzzed in according to the app.
      setTimeout(() => {
        const set = new Set(buzzedInPins.value);
        for (const pin of inactive) {
          set.delete(pin);
        }
        buzzedInPins.next(set);
      }, 250);
    }
  }).finally(() => {
    buzzedInPins.next(new Set());
    connected = false;
    gamesServices.setBuzzerConnected(gameUID, false);
  });
}

// For development without an active buzzer connection.
function fakeConnect(gameUID: string) {
  connected = true;
  if (gameUID) {
    gamesServices.setBuzzerConnected(gameUID, true);
    listenForBuzz(gameUID);
  }
  document.addEventListener("keydown", (e) => {
    const keys = "12345678!@#$%^&*";
    if (keys.includes(e.key)) {
      const contestant = keys.indexOf(e.key);
      const pin = configServices.DEFAULT_CONFIG.pinMappings[contestant];
      buzzedInPins.next(new Set(buzzedInPins.value).add(pin));
      setTimeout(() => {
        const set = new Set(buzzedInPins.value);
        set.delete(pin);
        buzzedInPins.next(set);
      }, 3000);
    } else if (e.key === "0") {
      buzzedInPins.next(new Set());
    }
  });
}
// Install fakeConnect on the global object.
(globalThis as { [key: string]: unknown }).fakeConnect = fakeConnect;

function useConnected(): boolean {
  const game = gamesServices.useGame();
  const leader = gamesServices.useLeader();
  // If the leader view hasn't connected, then the value in the game is stale.
  useEffect(() => {
    if (leader && !connected) {
      if (game.buzzerConnected) {
        gamesServices.setBuzzerConnected(game.uid, false);
      }
      if (game.buzzedInContestant !== undefined) {
        gamesServices.setBuzz(game.uid, undefined);
      }
    }
  }, [leader, connected, game.buzzerConnected, game.buzzedInContestant]);
  return !!game.buzzerConnected;
}

export function useBuzzzedInPins(): Set<number> {
  const [state, setState] = useState<Set<number>>(new Set());
  useEffect(() => {
    buzzedInPins.subscribe(setState);
    return () => buzzedInPins.unsubscribe(setState);
  }, []);
  return state;
}

export default {
  connect,
  useConnected,
  dismissBuzz,
  useBuzzzedInPins,
};
