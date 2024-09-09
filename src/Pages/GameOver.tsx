import type React from "react";

import Services from "../services";

const GameOver: React.FC = () => {
  const game = Services.games.useGame();

  return (
    <main id="question">
      <div className="finalheader">
        <div>Game Over</div>
        {game.contestants.length > 0 && (
          <div className="winner">
            {
              game.contestants.reduce((prev, current) =>
                prev.score > current.score ? prev : current
              ).name
            }{" "}
            wins!
          </div>
        )}{" "}
      </div>
    </main>
  );
};

export default GameOver;
