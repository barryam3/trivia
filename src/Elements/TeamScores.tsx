import type React from "react";

import Services from "../services";
import { useParams } from "react-router";

interface ScoreProps {
  reverse: boolean;
  score: number;
  name: string;
}

// Helper component to display a single name and score.
const Score: React.FC<ScoreProps> = ({ reverse, score, name }) => (
  <div className={`hstack ${reverse ? "reverse" : ""}`}>
    <span className={`scorescore pad ${score < 0 ? "negative" : ""}`}>
      {`${score < 0 ? "-" : ""}$${Math.abs(score)}`}
    </span>
    <span className="scorename pad">{name}</span>
  </div>
);

interface TeamScoresProps {
  teamIndex: number;
}

// Component to display the scores for a single team in a column.
const TeamScores: React.FC<TeamScoresProps> = ({ teamIndex }) => {
  const { uid, contestants, teams } = Services.games.useGame();
  if (!teams) {
    throw new Error("TeamScores requires teams.");
  }
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

  const onTeam = (key: number) =>
    key >= (teamIndex * contestants.length) / teams.length &&
    key < ((teamIndex + 1) * contestants.length) / teams.length;

  const teamScore = contestants
    .filter((_, key) => onTeam(key))
    .reduce((acc, c) => acc + c.score, 0);

  const reverse = teamIndex < teams.length - 1;

  return (
    <div id="team-scores">
      <Score reverse={reverse} score={teamScore} name={teams[teamIndex]} />
      {contestants
        .map((c, key) => (
          <div key={c.name} className={reverse ? "reverse" : ""}>
            <Score reverse={reverse} score={c.score} name={c.name} />
            {leader && (
              <div className="hstack">
                <div className="buttons vstack">
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
                  )}{" "}
                </div>
                <div className="buttons vstack">
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
              </div>
            )}
          </div>
        ))
        .filter((_, key) => onTeam(key))}
    </div>
  );
};

export default TeamScores;
