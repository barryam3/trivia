import Scores from "./Scores";
import gamesServices from "../services/gamesServices";
import React from "react";

export const DynamicScores: React.FC = () => {
  const { buzzedInContestant, extraneousBuzzedInContestants } =
    gamesServices.useGame();
  const nextContestantsToShow = new Set([
    ...(buzzedInContestant != null ? [buzzedInContestant] : []),
    ...(extraneousBuzzedInContestants ?? []),
  ]);
  const [contestantsToShow, setContestantsToShow] = React.useState(
    nextContestantsToShow
  );
  React.useEffect(() => {
    const removedContestants = Array.from(contestantsToShow).filter(
      (contestant) => !nextContestantsToShow.has(contestant)
    );
    const addedContestants = Array.from(nextContestantsToShow).filter(
      (contestant) => !contestantsToShow.has(contestant)
    );
    if (removedContestants.length > 0) {
      setTimeout(() => {
        setContestantsToShow((prevContestantsToShow) => {
          for (const contestant of removedContestants) {
            prevContestantsToShow.delete(contestant);
          }
          return new Set(prevContestantsToShow);
        });
      }, 0);
    }
    if (addedContestants.length > 0) {
      setContestantsToShow((prevContestantsToShow) => {
        for (const contestant of addedContestants) {
          prevContestantsToShow.add(contestant);
        }
        return new Set(prevContestantsToShow);
      });
    }
  });
  if (contestantsToShow.size === 0) {
    return (
      <div style={{ visibility: "hidden" }}>
        <Scores contestantsToShow={[0]} />
      </div>
    );
  }
  return <Scores contestantsToShow={Array.from(contestantsToShow)} />;
};
