import type React from "react";

import Services from "../services";
import { useParams } from "react-router";
import scoreServices from "../services/scoreServices";

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
  const { contestants, teams, buzzedInContestant } = Services.games.useGame();
  if (!teams) {
    throw new Error("TeamScores requires teams.");
  }
  const multiplier = Services.games.useMultiplier();
  const leader = Services.games.useLeader();
  const params = useParams<"question" | "round" | "category">();
  const value = params.question ? Number(params.question) + 1 : 0;
  const { updateScore, right, wrong } = scoreServices.useUpdateScoreCallback();

  const reverse = teamIndex < teams.length - 1;

  const onTeam = (key: number) =>
    scoreServices.onTeam(teams, contestants, teamIndex, key);

  const teamScore = scoreServices.computeTeamScore(
    teams,
    contestants,
    teamIndex
  );

  return (
    <div id="team-scores">
      <Score reverse={reverse} score={teamScore} name={teams[teamIndex]} />
      {contestants
        .map((c, key) => (
          <div
            key={c.name}
            className={`${buzzedInContestant === key ? "buzzed" : ""} ${
              reverse ? "reverse" : ""
            }`}
          >
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
                      onClick={wrong(key)}
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
                      onClick={right(key)}
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
