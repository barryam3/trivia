import React from "react";

import Services from "../services";
import { useParams } from "react-router";
import scoreServices from "../services/scoreServices";

const Scores: React.FC = () => {
  const { contestants, buzzedInContestant } = Services.games.useGame();
  const multiplier = Services.games.useMultiplier();
  const leader = Services.games.useLeader();
  const params = useParams<"question" | "round" | "category">();
  const value = params.question ? Number(params.question) + 1 : 0;
  const updateScore = scoreServices.useUpdateScoreCallback();

  return (
    <div id="scores">
      {contestants.map((c, key) => (
        <div
          key={c.name}
          className={buzzedInContestant === key ? "buzzed" : ""}
        >
          {buzzedInContestant === key && (
            <div className="buzzed-in-bar buzzed-in-bar-top" />
          )}
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
          {buzzedInContestant === key && (
            <div className="buzzed-in-bar buzzed-in-bar-bottom" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Scores;
