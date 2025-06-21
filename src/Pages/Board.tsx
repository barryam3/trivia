import React from "react";

import { range } from "../utils/range";
import services from "../services";
import NotFound from "./NotFound";
import { Link, useLocation } from "react-router";

const Board: React.FC = () => {
  const leader = services.games.useLeader();
  const round = services.games.useRound();
  const { search } = useLocation();
  const multiplier = services.games.useMultiplier();
  if (!round) {
    return <NotFound />;
  }
  const board = round.categories;

  let numC: number;
  let qPerC!: number;
  if (board.length > 0) {
    numC = board.length;
    qPerC = board[0].questions.length;
  }

  return board.length > 0 ? (
    <div id="board">
      {board.map((category, ckey) => (
        <div
          key={category.title}
          className="ctitle"
          style={{ gridRow: 1, gridColumn: ckey + 1 }}
        >
          <span>{category.title}</span>
        </div>
      ))}
      {range(0, qPerC).map((vkey) => (
        <React.Fragment key={vkey}>
          {range(0, numC).map((ckey) => (
            <div
              key={ckey}
              className="qvalue"
              style={{ gridRow: vkey + 2, gridColumn: ckey + 1 }}
            >
              {!board[ckey].questions[vkey].asked && (
                <React.Fragment>
                  {leader ? (
                    <Link to={{ pathname: `${ckey}/${vkey}`, search: search }}>
                      ${multiplier * (vkey + 1)}
                    </Link>
                  ) : (
                    <span>${multiplier * (vkey + 1)}</span>
                  )}
                </React.Fragment>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  ) : (
    <div />
  );
};

export default Board;
