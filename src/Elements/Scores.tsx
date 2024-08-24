import React, { useState } from "react";

import Services from "../services";
import { Contestant } from "../interfaces/game";

interface Props {
  contestants: Contestant[];
  uid: string;
  leader: boolean;
  value: number | null;
  multiplier: number;
}

const Scores: React.FC<Props> = (props) => {
  const [state, setState] = useState({
    contestants: props.contestants,
  });

  const contestants =
    props.leader && state.contestants.length
      ? state.contestants
      : props.contestants;

  const updateScore = (key: number, diff: number) => {
    return () => {
      contestants[key].score += diff;
      setState(() => ({ contestants }));
      Services.games.updateScore(props.uid, key, diff);
    };
  };

  return (
    <div id="scores">
      {contestants.map((c, key) => (
        <div key={key}>
          {props.leader && (
            <div className="buttons">
              <button
                type="button"
                className="scorebutton"
                style={{ backgroundColor: "red" }}
                onClick={updateScore(key, -1)}
              >
                -
              </button>
              {props.value != null && (
                <button
                  type="button"
                  className="scorebutton"
                  style={{ backgroundColor: "red" }}
                  onClick={updateScore(key, -props.multiplier * props.value)}
                >
                  W
                </button>
              )}
            </div>
          )}
          <div>
            <div className="scorename">{c.name}</div>
            <div className="scorescore">${c.score}</div>
          </div>
          {props.leader && (
            <div className="buttons">
              <button
                type="button"
                className="scorebutton"
                style={{ backgroundColor: "green" }}
                onClick={updateScore(key, 1)}
              >
                +
              </button>
              {props.value != null && (
                <button
                  type="button"
                  className="scorebutton"
                  style={{ backgroundColor: "green" }}
                  onClick={updateScore(key, props.multiplier * props.value)}
                >
                  R
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Scores;
