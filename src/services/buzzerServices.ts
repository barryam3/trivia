import type * as _ from "w3c-web-serial";
import gamesServices from "./gamesServices";
import { useEffect, useState, createContext } from "react";

// serialListen must only ever run once.
let serialConnected = false;

const JSON_REGEX = /({[^}]*})(.*)/g;

async function serialListen(onValue: (value: string) => void) {
  if (serialConnected || !("serial" in navigator)) {
    return undefined;
  }
  serialConnected = true;
  // Get all serial ports the user has previously granted the website access to.
  const ports = await navigator.serial.getPorts();
  // If there is not exactly one port, request a port.
  const port =
    ports.length === 1 ? ports[0] : await navigator.serial.requestPort();
  try {
    await port.open({ baudRate: 9600 });
  } catch (error) {
    // Ignore if port is already open. This is just for hot reload.
    if (error instanceof Error && error.name === "InvalidStateError") {
      return;
    }
    throw error;
  }
  if (!port.readable) {
    return undefined;
  }
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  // Listen to data coming from the serial device.
  let cumulativeValue = "";
  while (true) {
    const { value, done } = await reader.read();
    cumulativeValue += value;
    const match = JSON_REGEX.exec(cumulativeValue);
    if (match) {
      onValue(match[1]);
      cumulativeValue = match[2];
    }
  }
  await readableStreamClosed;
}

export function useBuzzer(): number | undefined {
  const leader = gamesServices.useLeader();
  const gameUID = gamesServices.useGame().uid;
  const [state, setState] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (leader) {
      serialListen((value: string) => {
        let obj: Record<string, number>;
        try {
          obj = JSON.parse(value);
        } catch (e) {
          throw new Error("Invalid JSON: " + value);
        }
        const entries = Object.entries(obj);
        if (entries.length !== 1) {
          return;
        }
        const [contestant, state] = entries[0];
        // TODO: This is a hack to get the contestant number.
        const contestantNumber = Number(contestant) - 39;
        console.log(contestantNumber, state);
        if (state === 0) {
          gamesServices.setBuzz(gameUID, contestantNumber);
        } else if (state === 1) {
          gamesServices.setBuzz(gameUID, undefined);
        }
      });
    }
  }, [leader, gameUID]);
  return state;
}

export const BuzzerContext = createContext<number | undefined>(undefined);

export default {
  useBuzzer,
  BuzzerContext,
};
