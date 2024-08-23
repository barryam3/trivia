import React, { Component } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Services from "../services";
import { Category } from "../interfaces/game";

function range(start: number, stop: number): number[] {
  const arr = [];
  let i;
  for (i = 0; i < stop; i += 1) {
    arr.push(i);
  }
  return arr;
}

interface Params {
  gameUID: string;
}

interface Props extends RouteComponentProps<Params> {
  leader: boolean;
  board: Category[];
  multiplier: number;
}

class Board extends Component<Props> {
  componentWillMount() {
    const { leader, match } = this.props;
    if (leader) {
      Services.games.updateScreen(match.params.gameUID, "board");
    }
  }

  render() {
    let numC: number;
    let qPerC!: number;
    if (this.props.board.length > 0) {
      numC = this.props.board.length;
      qPerC = this.props.board[0].questions.length;
    }

    return this.props.board.length > 0 ? (
      <div id="board">
        {this.props.board.map((category, ckey) => (
          <div
            key={ckey}
            className="ctitle"
            style={{ gridRow: 1, gridColumn: ckey + 1 }}
          >
            <span>{category.title}</span>
          </div>
        ))}
        {range(0, qPerC).map((vkey) => (
          <React.Fragment>
            {range(0, numC).map((ckey) => (
              <div
                key={ckey}
                className="qvalue"
                style={{ gridRow: vkey + 2, gridColumn: ckey + 1 }}
              >
                {!this.props.board[ckey].questions[vkey].asked && (
                  <React.Fragment>
                    {this.props.leader ? (
                      <a
                        href={`question?q=${ckey * qPerC + vkey}&leader=${
                          this.props.leader
                        }`}
                      >
                        ${this.props.multiplier * (vkey + 1)}
                      </a>
                    ) : (
                      <span>${this.props.multiplier * (vkey + 1)}</span>
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
  }
}

export default withRouter(Board);
