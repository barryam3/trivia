import { useParams } from "react-router";
import gamesServices from "./gamesServices";
import buzzerServices from "./buzzerServices";
import React from "react";
import { useEventCallback } from "usehooks-ts";
import type { Contestant } from "../interfaces/game";

let keydownListenerInstalled = false;

const rightAnswerEventSource = new EventTarget();
const rightAnswerEventName = "right-answer";
export function onRightAnswer(callback: () => void): () => void {
  rightAnswerEventSource.addEventListener(rightAnswerEventName, callback);
  return () => {
    rightAnswerEventSource.removeEventListener(rightAnswerEventName, callback);
  };
}

export function useUpdateScoreCallback() {
  const { uid, buzzedInContestant, buzzerConnected } = gamesServices.useGame();
  const multiplier = gamesServices.useMultiplier();
  const leader = gamesServices.useLeader();
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
    return async () => {
      const diff = absDiff
        ? op === "add"
          ? absDiff
          : -absDiff
        : getScoreDiff(op);
      if (diff === 0) return;
      // Dismiss buzz for wrong answer as soon as buzzer is reset. Don't show score change until then.
      if (op === "subtract") {
        await buzzerServices.dismissBuzz(uid);
      }
      gamesServices.updateScore(
        uid,
        key,
        diff,
        Number(params.round),
        Number(params.category),
        Number(params.question)
      );
      // For right answer, show score change immediately. Then dismiss buzz after 1s.
      if (op === "add") {
        rightAnswerEventSource.dispatchEvent(new Event(rightAnswerEventName));
        setTimeout(() => {
          buzzerServices.dismissBuzz(uid);
        }, 1000);
      }
    };
  };

  // r for right, w for wrong, d for dismiss
  const onKeyDown = useEventCallback(async (e: KeyboardEvent) => {
    if (buzzedInContestant == null) return;
    if (!"rwd".includes(e.key)) return;
    if (e.key === "d") {
      buzzerServices.dismissBuzz(uid);
      return;
    }
    const diff = multiplier * value * (e.key === "r" ? 1 : -1);
    updateScore(buzzedInContestant, e.key === "r" ? "add" : "subtract", diff)();
  });

  React.useEffect(() => {
    if (!buzzerConnected || !leader || keydownListenerInstalled) return;
    keydownListenerInstalled = true;
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      keydownListenerInstalled = false;
    };
  }, [buzzerConnected, onKeyDown, leader]);

  return updateScore;
}

export function onTeam(
  teams: string[],
  contestants: Contestant[],
  teamIndex: number,
  key: number
) {
  return (
    key >= (teamIndex * contestants.length) / teams.length &&
    key < ((teamIndex + 1) * contestants.length) / teams.length
  );
}

export function computeTeamScore(
  teams: string[],
  contestants: Contestant[],
  teamIndex: number
) {
  return contestants
    .filter((_, key) => onTeam(teams, contestants, teamIndex, key))
    .reduce((acc, c) => acc + c.score, 0);
}

export default {
  useUpdateScoreCallback,
  onTeam,
  computeTeamScore,
  onRightAnswer,
};
