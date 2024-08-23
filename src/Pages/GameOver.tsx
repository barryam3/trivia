import React, { useEffect } from "react";

import { useParams } from "react-router-dom";

import Services from "../services";
import { Contestant } from "../interfaces/game";

interface Params {
  gameUID: string;
}

interface Props {
  leader: boolean;
  contestants: Contestant[];
}

const GameOver: React.FC<Props> = ({ leader, contestants }) => {
  const params = useParams<Params>();

  useEffect(() => {
    if (leader) {
      Services.games.updateScreen(params.gameUID, "gameover");
      window.location.assign("gameover");
    }
  }, [leader, params.gameUID]);

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
