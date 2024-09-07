import type React from "react";

import Services from "../services";

const GameOver: React.FC = () => {
  const game = Services.games.useGame();

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
