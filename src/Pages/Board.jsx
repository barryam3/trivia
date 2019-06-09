import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import FitText from '@kennethormandy/react-fittext';

import Services from '../services';

function range(start, stop) {
  const arr = [];
  let i;
  for (i = 0; i < stop; i += 1) {
    arr.push(i);
  }
  return arr;
}

class Board extends Component {
  componentWillMount() {
    const { master, match } = this.props;
    if (master) {
      Services.games.updateScreen(match.params.gameUID, 'board');
    }
  }

  render() {
    let numC;
    let qPerC;
    if (this.props.board.length > 0) {
      numC = this.props.board.length;
      qPerC = this.props.board[0].questions.length;
    }

    return this.props.board.length > 0 ? (
      <main>
        <table id="board">
          <tbody style={{ height: '100%' }}>
            <tr className="crow">
              {this.props.board.map((category, ckey) => (
                <th key={ckey} className="ctitle">
                  <FitText compressor={0.9}>
                    <span>{category.title}</span>
                  </FitText>
                </th>
              ))}
            </tr>
            {range(0, qPerC).map(vkey => (
              <tr key={vkey} className="qrow">
                {range(0, numC).map(ckey => (
                  <td key={ckey} className="qvalue">
                    {!this.props.board[ckey].questions[vkey].asked && (
                      <FitText compressor={0.5}>
                        {this.props.master ? (
                          <a
                            href={`question?q=${ckey * qPerC + vkey}&master=${
                              this.props.master
                            }`}
                          >
                            ${this.props.multiplier * (vkey + 1)}
                          </a>
                        ) : (
                          <span>${this.props.multiplier * (vkey + 1)}</span>
                        )}
                      </FitText>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    ) : (
      <main />
    );
  }
}

export default withRouter(Board);
