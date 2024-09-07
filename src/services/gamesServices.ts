import * as gameModel from "../models/game";
import type { Round, Game } from "../interfaces/game";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

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
  /** Hook for getting game and responding to mutations. */
  useGame(): Game {
    const { gameUID } = useParams<"gameUID">();
    if (!gameUID) {
      throw new Error('Missing "gameUID" parameter');
    }
    const [state, setState] = useState(gameModel.getGame(gameUID));
    useEffect(() => {
      const bc = new BroadcastChannel(gameUID);
      bc.onmessage = (e: MessageEvent<Game>) => setState(e.data);
      return () => bc.close();
    }, [gameUID]);
    return state;
  },
  /** Hook for getting whether this window is for the leader view. */
  useLeader(): boolean {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    return Boolean(query.get("leader"));
  },
  useRound(): Round | null {
    const game = this.useGame();
    const params = useParams<"round">();
    switch (params.round) {
      case "1":
        return game.single;
      case "2":
        return game.double;
      default:
        return null;
    }
  },
};

export default gamesServices;
