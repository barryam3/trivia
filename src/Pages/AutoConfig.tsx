import type React from "react";
import { useEffect, useRef, useState } from "react";

import buzzerServices from "../services/buzzerServices";
import gamesServices from "../services/gamesServices";
import { useNavigate } from "react-router";
import configServices from "../services/configServices";

const AutoConfig: React.FC = () => {
  // In theory this could be done without a game, but we use it to get the contestant names.
  const game = gamesServices.useGame();
  // Listen to the raw buzzer system pin outputs.
  const buzzedInPins = buzzerServices.useBuzzzedInPins();
  // Create array for contestant pin mappings.
  const config = useRef<(number | null)[]>(game.contestants.map(() => null));
  // Start with the first contestant.
  const [turn, setTurn] = useState(0);
  const navigate = useNavigate();

  // Connect to the buzzer system.
  useEffect(() => {
    buzzerServices.connect(game.uid);
  }, [game.uid]);

  useEffect(() => {
    // When someone buzzes in, set the pin mapping for the current contestant, if that pin
    // mapping is not already in use.
    if (buzzedInPins.size === 1) {
      const pin = Array.from(buzzedInPins)[0];
      if (!config.current.includes(pin)) {
        config.current[turn] = pin;
      }
    }
    // Go to next turn once the buzzer system has reset and if a pin mapping is set for the
    // current contestant. Updating the turn will make the effect run again, so the null check
    // is important.
    if (buzzedInPins.size === 0 && config.current[turn] != null) {
      // After the last contestant, set the config and navigate to the game.
      if (turn === game.contestants.length - 1) {
        configServices.setConfig({
          pinMappings: config.current as number[],
        });
        navigate(`/game/${game.uid}`);
      } else {
        setTurn(turn + 1);
      }
    }
  }, [buzzedInPins, turn, game, navigate]);

  return (
    <div>
      <h1 id="finalheader">{game.contestants[turn].name}</h1>
      {buzzedInPins.size === 1 && <h2>{Array.from(buzzedInPins)[0]}</h2>}
    </div>
  );
};

export default AutoConfig;
