import type React from "react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Scores from "./Elements/Scores";
import services from "./services/index";

const Game: React.FC = () => {
  const location = useLocation();
  const leader = services.games.useLeader();

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
      <div id="game-content">
        <Outlet />
      </div>
      <Scores />
    </div>
  );
};

export default Game;
