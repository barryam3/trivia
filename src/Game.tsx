import type React from "react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Scores from "./Elements/Scores";
import services from "./services/index";
import type { Game as IGame } from "./interfaces/game";

function useGameScreen(game: IGame, leader: boolean) {
  useEffect(() => {
    if (leader) return;
    if (window.location.pathname.includes("gameover")) return;
    if (!window.location.href.endsWith(game.screen)) {
      window.location.assign(game.screen);
    }
  }, [game, leader]);
}

const Game: React.FC = () => {
  const location = useLocation();
  const game = services.games.useGame();
  const query = new URLSearchParams(location.search);
  const leader = services.games.useLeader();
  useGameScreen(game, leader);

  const board =
    game.round === "single" ? game.single.categories : game.double.categories;
  const finalLoaded = game.round === "final";
  const q = query.get("q");

  if (finalLoaded && window.location.pathname.endsWith("board")) {
    window.location.assign(`question?q=final&leader=${leader}`);
  }
  let value: number | null;
  if (q != null && board.length > 0) {
    const qID = Number(q);
    const qPerC = board[0].questions.length;
    value = (qID % qPerC) + 1; // value
  } else {
    value = null;
  }

  return (
    <div id="game">
      <div id="game-content">
        <Outlet />
      </div>
      <Scores
        contestants={game.contestants}
        uid={game.uid}
        leader={leader}
        multiplier={(game.round === "double" ? 2 : 1) * game.multiplier}
        value={value}
      />
    </div>
  );
};

export default Game;
