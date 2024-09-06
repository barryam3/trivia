import React, { useEffect } from "react";

import Services from "../services";
import type { Category } from "../interfaces/game";
import { range } from "../utils/range";

interface Props {
  gameUID: string;
  leader: boolean;
  board: Category[];
  multiplier: number;
}

const Board: React.FC<Props> = ({ gameUID, leader, board, multiplier }) => {
  useEffect(() => {
    if (leader) {
      Services.games.updateScreen(gameUID, "board");
    }
  }, [leader, gameUID]);

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
                    <a
                      href={`question?q=${
                        ckey * qPerC + vkey
                      }&leader=${leader}`}
                    >
                      ${multiplier * (vkey + 1)}
                    </a>
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
