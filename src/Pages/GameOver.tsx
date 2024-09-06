import type React from "react";
import { useEffect } from "react";

import Services from "../services";

const GameOver: React.FC = () => {
  const game = Services.games.useGame();
  const leader = Services.games.useLeader();
  useEffect(() => {
    if (leader) {
      Services.games.updateScreen(game.uid, "gameover");
      window.location.assign("gameover");
    }
  }, [leader, game.uid]);

  return (
    <main>
      <div className="finalheader">Game Over</div>
      {game.contestants.length > 0 && (
        <div className="winner">
          {
            game.contestants.reduce((prev, current) =>
              prev.score > current.score ? prev : current
            ).name
          }{" "}
          wins!
        </div>
      )}
    </main>
  );
};

export default GameOver;
