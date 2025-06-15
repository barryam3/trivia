import * as gameModel from "../models/game";
import type { Round, Game, Category } from "../interfaces/game";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

const withBroadcast =
  <A extends unknown[]>(f: (uid: string, ...args: A) => Game) =>
  (uid: string, ...args: A) => {
    const bc = new BroadcastChannel(uid);
    const game = f(uid, ...args);
    bc.postMessage(game);
    bc.close();
    return game;
  };

const gamesServices = {
  addGame: withBroadcast(gameModel.addGame),
  askQuestion: withBroadcast(gameModel.askQuestion),
  updateScore: withBroadcast(gameModel.updateScore),
  setBuzz: withBroadcast(gameModel.setBuzz),
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
  useCategory(): Category | null {
    const round = this.useRound();
    const { category } = useParams<"category">();
    return round?.categories[Number(category)] ?? null;
  },
  useMultiplier(): number {
    const game = this.useGame();
    const params = useParams<"round">();
    switch (params.round) {
      case "1":
        return game.multiplier;
      case "2":
        return game.multiplier * 2;
      default:
        return 0;
    }
  },
};

export default gamesServices;
