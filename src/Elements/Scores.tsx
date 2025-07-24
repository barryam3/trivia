import React from "react";

import Services from "../services";
import { useParams } from "react-router";
import scoreServices from "../services/scoreServices";

interface ScoresProps {
  contestantsToShow?: number[];
}

const Scores: React.FC<ScoresProps> = ({ contestantsToShow }) => {
  const {
    contestants,
    buzzedInContestant,
    extraneousBuzzedInContestants,
    unit,
  } = Services.games.useGame();
  const multiplier = Services.games.useMultiplier();
  const leader = Services.games.useLeader();
  const params = useParams<"question" | "round" | "category">();
  const value = params.question ? Number(params.question) + 1 : 0;
  const updateScore = scoreServices.useUpdateScoreCallback();
  const buzzedIn = (key: number) =>
    buzzedInContestant === key ||
    (extraneousBuzzedInContestants ?? []).includes(key);

  return (
    <div id="scores">
      {contestants
        .map((c, key) => (
          <div
            key={c.name}
            className={`${buzzedIn(key) ? "buzzed" : ""} ${
              extraneousBuzzedInContestants?.includes(key) ? "extraneous" : ""
            }`}
          >
            {buzzedIn(key) && (
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
                {`${c.score < 0 ? "-" : ""}${unit || ""}${Math.abs(c.score)}`}
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
            {buzzedIn(key) && (
              <div className="buzzed-in-bar buzzed-in-bar-bottom" />
            )}
          </div>
        ))
        .filter(
          (c, key) => !contestantsToShow || contestantsToShow.includes(key)
        )}
    </div>
  );
};

export default Scores;
