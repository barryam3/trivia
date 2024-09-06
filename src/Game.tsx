import type React from "react";
import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";

import Scores from "./Elements/Scores";
import Board from "./Pages/Board";
import Question from "./Pages/Question";
import GameOver from "./Pages/GameOver";
import services from "./services/index";
import NotFound from "./Pages/NotFound";
import type { Game as IGame } from "./interfaces/game";

// Dollar value of the lowest-value question
// 200 for classic Jeopardy
const kDollarMultiplier = 2;

interface Params extends Record<string, string | undefined> {
  gameUID: string;
}

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
  const { gameUID } = useParams<Params>();
  if (!gameUID) {
    throw new Error('Missing "gameUID" parameter');
  }
  const game = services.games.useGame(gameUID);
  const query = new URLSearchParams(location.search);
  const leader = Boolean(query.get("leader"));
  useGameScreen(game, leader);

  const board =
    game.round === "single" ? game.single.categories : game.double.categories;
  const final = game.final;
  const finalLoaded = game.round === "final";
  const shown = game.shown;
  const multiplier = (game.round === "double" ? 2 : 1) * kDollarMultiplier;
  const contestants = game.contestants;
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
        <Routes>
          <Route
            path={"board"}
            element={
              <Board
                gameUID={gameUID}
                leader={leader}
                board={board}
                multiplier={multiplier}
              />
            }
          />
          <Route
            path={"question"}
            element={
              <Question
                gameUID={gameUID}
                leader={leader}
                shown={shown}
                board={board}
                final={final}
                finalLoaded={finalLoaded}
                multiplier={multiplier}
              />
            }
          />
          <Route
            path={"gameover"}
            element={
              <GameOver
                gameUID={gameUID}
                leader={leader}
                contestants={contestants}
              />
            }
          />
          <Route
            path={""}
            element={<Navigate replace to={{ pathname: "board" }} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Scores
        contestants={game.contestants}
        uid={gameUID}
        leader={leader}
        multiplier={(game.round === "double" ? 2 : 1) * kDollarMultiplier}
        value={value}
      />
    </div>
  );
};

export default Game;
