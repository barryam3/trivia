import React, { useState } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Services from "../services";
import { Contestant } from "../interfaces/game";

interface Props extends RouteComponentProps {
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

  const contestants = props.leader ? state.contestants : props.contestants;

  const updateScore = (key: number, diff: number) => {
    return () => {
      setState((prevState) => {
        const newState = JSON.parse(JSON.stringify(prevState));
        newState.contestants[key].score += diff;
        return prevState;
      });
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

export default withRouter(Scores);
