import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import Services from '../services';

class GameOver extends Component {
  componentWillMount() {
    if (this.props.leader) {
      Services.games.updateScreen(this.props.match.params.gameUID, 'gameover');
      window.location = 'gameover';
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
            }{' '}
            wins!
          </div>
        )}
      </main>
    );
  }
}

export default withRouter(GameOver);
