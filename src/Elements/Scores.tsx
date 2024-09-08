import type React from "react";

import Services from "../services";
import { useParams } from "react-router-dom";

const Scores: React.FC = () => {
  const { uid, contestants, multiplier } = Services.games.useGame();
  const leader = Services.games.useLeader();
  const params = useParams<"question">();
  const value = Number(params.question ?? 1) + 1;

  const getScoreDiff = (op: "add" | "subtract") => {
    const diff = Number(prompt(`How many points to ${op}?`));
    return op === "add" ? diff : -diff;
  };

  const updateScore = (
    key: number,
    op: "add" | "subtract",
    absDiff?: number
  ) => {
    return () => {
      const diff = absDiff
        ? op === "add"
          ? absDiff
          : -absDiff
        : getScoreDiff(op);
      contestants[key].score += diff;
      Services.games.updateScore(uid, key, diff);
    };
  };

  return (
    <div id="scores">
      {contestants.map((c, key) => (
        <div key={c.name}>
          {leader && (
            <div className="buttons">
              <button
                type="button"
                className="scorebutton"
                style={{ backgroundColor: "red" }}
                onClick={updateScore(key, "subtract")}
              >
                -
              </button>
              {value != null && (
                <button
                  type="button"
                  className="scorebutton"
                  style={{ backgroundColor: "red" }}
                  onClick={updateScore(key, "subtract", multiplier * value)}
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
          {leader && (
            <div className="buttons">
              <button
                type="button"
                className="scorebutton"
                style={{ backgroundColor: "green" }}
                onClick={updateScore(key, "add")}
              >
                +
              </button>
              {value != null && (
                <button
                  type="button"
                  className="scorebutton"
                  style={{ backgroundColor: "green" }}
                  onClick={updateScore(key, "add", multiplier * value)}
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
