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
  const { uid, buzzedInContestant, buzzerConnected, flatPenalties } =
    gamesServices.useGame();
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
      if (op === "subtract" && key === buzzedInContestant) {
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
      if (op === "add" && key === buzzedInContestant) {
        rightAnswerEventSource.dispatchEvent(new Event(rightAnswerEventName));
        setTimeout(() => {
          buzzerServices.dismissBuzz(uid);
        }, 1000);
      }
    };
  };

  const right = (key: number) => updateScore(key, "add", multiplier * value);
  const wrong = (key: number) =>
    updateScore(key, "subtract", multiplier * (flatPenalties ? 1 : value));

  // r for right, w for wrong, d for dismiss, x for force dismiss
  const onKeyDown = useEventCallback(async (e: KeyboardEvent) => {
    if (buzzedInContestant == null) return;
    if (!"rwdx".includes(e.key)) return;
    switch (e.key) {
      case "r":
        return right(buzzedInContestant)();
      case "w":
        return wrong(buzzedInContestant)();
      case "d":
        return buzzerServices.dismissBuzz(uid);
      case "x":
        return buzzerServices.dismissBuzz(uid, /*force = */ true);
    }
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

  return { updateScore, right, wrong };
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
