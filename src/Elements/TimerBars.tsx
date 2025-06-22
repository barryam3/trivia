import { range } from "../utils/range";
import React from "react";

export function TimerBars({ buzzed }: { buzzed: boolean }) {
  const [secondsLeft, setSecondsLeft] = React.useState(buzzed ? 5 : 0);
  React.useEffect(() => {
    if (!buzzed) {
      setSecondsLeft(0);
      return;
    }

    setSecondsLeft(5);
    const interval = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [buzzed]);
  const isLit = (i: number) => Math.abs(i - 4) < secondsLeft;
  return (
    <div className="timer-bars">
      {range(0, 9).map((i) => (
        <div key={i} className={isLit(i) ? "timer-bar-lit" : ""} />
      ))}
    </div>
  );
}
