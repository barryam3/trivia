import type * as _ from "w3c-web-serial";
import gamesServices from "./gamesServices";
import configServices from "./configServices";
import { useEffect, useState } from "react";

// A subscribable value. Inspired by BehaviorSubject from RxJS.
class BehaviorSubject<T> {
  private _value: T;
  private _subscribers = new Set<(value: T) => void>();
  constructor(initialValue: T) {
    this._value = initialValue;
  }
  get value() {
    return this._value;
  }
  next(value: T): void {
    this._value = value;
    for (const fn of this._subscribers) {
      fn(value);
    }
  }
  subscribe(fn: (value: T) => void): void {
    this._subscribers.add(fn);
  }
  unsubscribe(fn: (value: T) => void): void {
    this._subscribers.delete(fn);
  }
}

// Hook for subscribing to a BehaviorSubject.
function useBehaviorSubject<T>(subject: BehaviorSubject<T>) {
  const [value, setValue] = useState(subject.value);
  useEffect(() => {
    subject.subscribe(setValue);
    return () => {
      subject.unsubscribe(setValue);
    };
  }, [subject]);
  return value;
}

// serialListen must only ever run once.
const CONNECTED = new BehaviorSubject<boolean>(false);

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

export function connect(gameUID: string) {
  if (CONNECTED.value) return;
  CONNECTED.next(true);
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
      gamesServices.setBuzz(gameUID, contestant);
    } else if (state === 1) {
      gamesServices.setBuzz(gameUID, undefined);
    }
  }).finally(() => {
    gamesServices.setBuzz(gameUID, undefined);
    CONNECTED.next(false);
  });
}

function useConnected(): boolean {
  return useBehaviorSubject(CONNECTED);
}

export default {
  connect,
  useConnected,
};
