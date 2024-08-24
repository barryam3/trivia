import * as gameModel from "../models/game";
import { Game } from "../interfaces/game";
import { useEffect, useState } from "react";

// Wrap function so that it returns a promise which resolves after notifying
// the broadcast channel or rejects with any thrown error. This was both to
// avoid code churn when written since the service methods used to be RPCs and
// to avoid code churn if they ever become RPCs again in the future.
const promisify =
  <A extends unknown[]>(f: (uid: string, ...args: A) => Game) =>
  (uid: string, ...args: A) =>
    new Promise<void>((resolve, reject) => {
      try {
        const bc = new BroadcastChannel(uid);
        bc.postMessage(f(uid, ...args));
        bc.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });

const gamesServices = {
  addGame: promisify(gameModel.addGame),
  askQuestion: promisify(gameModel.askQuestion),
  updateScore: promisify(gameModel.updateScore),
  updateScreen: promisify(gameModel.updateScreen),
  updateShown: promisify(gameModel.updateShown),
  /** Hook for getting game and responding to mutations. */
  useGame(uid: string): Game {
    const [state, setState] = useState(gameModel.getGame(uid));
    useEffect(() => {
      const bc = new BroadcastChannel(uid);
      bc.onmessage = (e: MessageEvent<Game>) => setState(e.data);
      return () => bc.close();
    }, [uid]);
    return state;
  },
};

export default gamesServices;
