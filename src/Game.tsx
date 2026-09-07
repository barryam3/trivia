import type React from "react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Scores from "./Elements/Scores";
import TeamScores from "./Elements/TeamScores";
import services from "./services/index";
import { SerialButton } from "./Elements/SerialButton";
import { TimerBars } from "./Elements/TimerBars";
import { DynamicScores } from "./Elements/DynamicScores";

const Game: React.FC = () => {
  const location = useLocation();
  const view = services.games.useView();
  const isHost = view === "host";
  const { teams, buzzedInContestant, enableDynamicScores } =
    services.games.useGame();
  const { pathname } = useLocation();
  const isGameOver = pathname.includes("gameover");
  const buzzerConnected = services.buzzer.useConnected();
  const showTeamScores =
    teams && (view !== "contestant" || isGameOver) && enableDynamicScores;

  // Whenever the host navigates, make the contestant and stream views navigate
  // while preserving their own view query parameters.
  const navigate = useNavigate();
  useEffect(() => {
    const bc = new BroadcastChannel("pathname");
    if (isHost) {
      bc.postMessage(location.pathname);
    } else {
      bc.onmessage = (event: MessageEvent<string>) => {
        navigate({ pathname: event.data, search: location.search });
      };
    }
    return () => bc.close();
  }, [isHost, location.pathname, location.search, navigate]);

  return (
    <div id="game">
      <SerialButton />
      <div className="hstack flex1 fill-parent">
        {showTeamScores && <TeamScores teamIndex={0} />}
        <div id="game-content">
          <Outlet />
        </div>
        {showTeamScores && <TeamScores teamIndex={1} />}
      </div>
      {!enableDynamicScores && <Scores />}
      {enableDynamicScores && <DynamicScores />}
      {buzzerConnected && <TimerBars buzzed={buzzedInContestant != null} />}
    </div>
  );
};

export default Game;
