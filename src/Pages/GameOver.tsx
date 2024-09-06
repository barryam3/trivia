import type React from "react";
import { useEffect } from "react";

import Services from "../services";
import type { Contestant } from "../interfaces/game";

interface Props {
  gameUID: string;
  leader: boolean;
  contestants: Contestant[];
}

const GameOver: React.FC<Props> = ({ gameUID, leader, contestants }) => {
  useEffect(() => {
    if (leader) {
      Services.games.updateScreen(gameUID, "gameover");
      window.location.assign("gameover");
    }
  }, [leader, gameUID]);

  return (
    <main>
      <div className="finalheader">Game Over</div>
      {contestants.length > 0 && (
        <div className="winner">
          {
            contestants.reduce((prev, current) =>
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
