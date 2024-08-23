import React, { Component } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Services from "../services";
import { Contestant } from "../interfaces/game";

interface Props extends RouteComponentProps {
  contestants: Contestant[];
  uid: string;
  leader: boolean;
  value: number|null;
  multiplier: number;
}

class Scores extends Component<Props> {
  state = {
    contestants: this.props.contestants,
  };

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ contestants: nextProps.contestants });
  }

  updateScore = (key: number, diff: number) => {
    return () => {
      this.setState((prevState) => {
        const newState = JSON.parse(JSON.stringify(prevState));
        newState.contestants[key].score += diff;
        return prevState;
      });
      Services.games.updateScore(this.props.uid, key, diff);
    };
  };

  render() {
    return (
      <div id="scores">
        {(this.state.contestants || []).map((c, key) => (
          <div key={key}>
            {this.props.leader && (
              <div className="buttons">
                <button
                  type="button"
                  className="scorebutton"
                  style={{ backgroundColor: "red" }}
                  onClick={this.updateScore(key, -1)}
                >
                  -
                </button>
                {this.props.value != null && (
                  <button
                    type="button"
                    className="scorebutton"
                    style={{ backgroundColor: "red" }}
                    onClick={this.updateScore(
                      key,
                      -this.props.multiplier * this.props.value
                    )}
                  >
                    W
                  </button>
                )}
              </div>
            )}
            <div>
              <div className="scorename">{c.name}</div>
              <div className="scorescore">${c.score}</div>
            </div>
            {this.props.leader && (
              <div className="buttons">
                <button
                  type="button"
                  className="scorebutton"
                  style={{ backgroundColor: "green" }}
                  onClick={this.updateScore(key, 1)}
                >
                  +
                </button>
                {this.props.value != null && (
                  <button
                    type="button"
                    className="scorebutton"
                    style={{ backgroundColor: "green" }}
                    onClick={this.updateScore(
                      key,
                      this.props.multiplier * this.props.value
                    )}
                  >
                    R
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(Scores);
