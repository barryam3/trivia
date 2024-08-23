import React, { Component } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import Services from "../services";
import { Contestant } from "../interfaces/game";

interface Params {
  gameUID: string;
}

interface Props extends RouteComponentProps<Params> {
  leader: boolean;
  contestants: Contestant[];
}

class GameOver extends Component<Props> {
  componentWillMount() {
    if (this.props.leader) {
      Services.games.updateScreen(this.props.match.params.gameUID, "gameover");
      window.location.assign("gameover");
    }
  }

  render() {
    return (
      <main>
        <div className="finalheader">Game Over</div>
        {this.props.contestants.length > 0 && (
          <div className="winner">
            {
              this.props.contestants.reduce((prev, current) =>
                prev.score > current.score ? prev : current
              ).name
            }{" "}
            wins!
          </div>
        )}
      </main>
    );
  }
}

export default withRouter(GameOver);
