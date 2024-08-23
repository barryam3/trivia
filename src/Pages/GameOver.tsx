import React, { useEffect } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Services from "../services";
import { Contestant } from "../interfaces/game";

interface Params {
  gameUID: string;
}

interface Props extends RouteComponentProps<Params> {
  leader: boolean;
  contestants: Contestant[];
}

const GameOver: React.FC<Props> = ({leader, contestants, match}) => {
  useEffect(() => {
    if (leader) {
      Services.games.updateScreen(match.params.gameUID, "gameover");
      window.location.assign("gameover");
    }
  }, [leader, match.params.gameUID]);

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

export default withRouter(GameOver);
