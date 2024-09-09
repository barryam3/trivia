import type React from "react";

import Services from "../services";
import { useParams } from "react-router-dom";

const Scores: React.FC = () => {
  const { uid, contestants } = Services.games.useGame();
  const multiplier = Services.games.useMultiplier();
  const leader = Services.games.useLeader();
  const params = useParams<"question" | "round" | "category">();
  const value = params.question ? Number(params.question) + 1 : 0;

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
      if (diff === 0) return;
      contestants[key].score += diff;
      Services.games.updateScore(
        uid,
        key,
        diff,
        Number(params.round),
        Number(params.category),
        Number(params.question)
      );
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
            <div className={`scorescore ${c.score < 0 ? "negative" : ""}`}>
              {`${c.score < 0 ? "-" : ""}$${Math.abs(c.score)}`}
            </div>
            <div className="scorename">{c.name}</div>
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
