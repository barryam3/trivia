import type React from "react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Scores from "./Elements/Scores";
import TeamScores from "./Elements/TeamScores";
import services from "./services/index";
import { SerialButton } from "./Elements/SerialButton";

const Game: React.FC = () => {
  const location = useLocation();
  const leader = services.games.useLeader();
  const { teams } = services.games.useGame();

  // Whenever a navigation happens in the leader view, make all follower views navigate.
  const navigate = useNavigate();
  useEffect(() => {
    const bc = new BroadcastChannel("pathname");
    if (leader) {
      bc.postMessage(location.pathname);
    } else {
      bc.onmessage = (event: MessageEvent<string>) => {
        navigate({ pathname: event.data });
      };
    }
    return () => bc.close();
  }, [leader, location, navigate]);

  return (
    <div id="game">
      <SerialButton />
      <div className="hstack flex1">
        {teams && <TeamScores teamIndex={0} />}
        <div id="game-content">
          <Outlet />
        </div>
        {teams && <TeamScores teamIndex={1} />}
      </div>
      {!teams && <Scores />}
    </div>
  );
};

export default Game;
