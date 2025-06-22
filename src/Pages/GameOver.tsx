import type React from "react";

import Services from "../services";
import type { Contestant } from "../interfaces/game";
import scoreServices from "../services/scoreServices";

function computeWinningContestants(
  contestants: { name: string; score: number }[]
): string[] {
  const maxScore = Math.max(...contestants.map((c) => c.score));
  return contestants.filter((c) => c.score === maxScore).map((c) => c.name);
}

function computeWinners(contestants: Contestant[], teams?: string[]) {
  if (!teams) {
    return computeWinningContestants(contestants);
  }
  const teamsWithScores = teams.map((name, teamIndex) => {
    const score = scoreServices.computeTeamScore(
      teams,
      contestants,
      teamIndex
    );
    return { name, score };
  });
  return computeWinningContestants(teamsWithScores);
}

function asEnglishList(items: string[]) {
  if (items.length === 0) {
    return "Nobody";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const GameOver: React.FC = () => {
  const game = Services.games.useGame();
  const winners = computeWinners(game.contestants, game.teams);
  const isTie = winners.length > 1;

  return (
    <main id="question">
      <div className="finalheader">
        <div>Game Over</div>
        {winners.length > 0 && (
          <div className="winner">
            {isTie ? "Tie! " : ""}
            {asEnglishList(winners)} win{!isTie ? "s" : ""}!
          </div>
        )}{" "}
      </div>
    </main>
  );
};

export default GameOver;
