import type React from "react";

import Services from "../services";
import type { Contestant } from "../interfaces/game";

interface Props {
  contestants: Contestant[];
  uid: string;
  leader: boolean;
  value: number | null;
  multiplier: number;
}

const Scores: React.FC<Props> = (props) => {
  const contestants = props.contestants;

  const updateScore = (key: number, diff: number) => {
    return () => {
      contestants[key].score += diff;
      Services.games.updateScore(props.uid, key, diff);
    };
  };

  return (
    <div id="scores">
      {contestants.map((c, key) => (
        <div key={c.name}>
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
