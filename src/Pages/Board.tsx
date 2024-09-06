import React, { useEffect } from "react";

import { useParams } from "react-router-dom";

import Services from "../services";
import type { Category } from "../interfaces/game";
import { range } from "../utils/range";

interface Params {
  gameUID: string;
}

interface Props {
  leader: boolean;
  board: Category[];
  multiplier: number;
}

const Board: React.FC<Props> = (props) => {
  const { leader } = props;
  const params = useParams<Params>();

  useEffect(() => {
    if (leader) {
      Services.games.updateScreen(params.gameUID, "board");
    }
  }, [leader, params.gameUID]);

  let numC: number;
  let qPerC!: number;
  if (props.board.length > 0) {
    numC = props.board.length;
    qPerC = props.board[0].questions.length;
  }

  return props.board.length > 0 ? (
    <div id="board">
      {props.board.map((category, ckey) => (
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
              {!props.board[ckey].questions[vkey].asked && (
                <React.Fragment>
                  {props.leader ? (
                    <a
                      href={`question?q=${ckey * qPerC + vkey}&leader=${
                        props.leader
                      }`}
                    >
                      ${props.multiplier * (vkey + 1)}
                    </a>
                  ) : (
                    <span>${props.multiplier * (vkey + 1)}</span>
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
