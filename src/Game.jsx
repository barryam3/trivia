import { Component } from 'react';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import Scores from './Elements/Scores.jsx';
import Board from './Pages/Board';
import Question from './Pages/Question';
import GameOver from './Pages/GameOver';
import services from './services';
import NotFound from './Pages/NotFound.jsx';

// Dollar value of the lowest-value question
// 200 for classic Jeopardy
const kDollarMultiplier = 1;

class Game extends Component {
  state = {
    game: {
      uid: '',
      round: '',
      contestants: [],
      single: {
        categories: [],
        earlyend: 0
      },
      double: {
        categories: [],
        earlyend: 0
      },
      final: {
        category: '',
        question: '',
        answer: ''
      },
      screen: '',
      shown: null
    }, // all of the state
    board: [], // single vs double jeopardy
    question: {
      category: '',
      question: '',
      answer: '',
      loaded: false
    }, // for final jeopardy
    lastScreen: ''
  };

  // repeatedly try function f every ddt msec for dt msec
  tryUntil = (f, dt, ddt) => {
    f();
    if (dt > 0) {
      setTimeout(() => this.tryUntil(f, dt - ddt, ddt), ddt);
    }
  };

  // for slave: check for updates to screen state to see if page must be reloaded
  checkForUpdates = () => {
    services.games.getGame(this.props.match.params.gameUID).then(res => {
      if (!window.location.href.endsWith(res.content.screen)) {
        window.location = res.content.screen;
      }
      this.setState({ game: res.content });
    });
  };

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const master = query.get('master');
    this.loadGame(this.props.match.params.gameUID);
    if (master !== 'true' && !window.location.pathname.includes('gameover')) {
      this.tryUntil(this.checkForUpdates, Infinity, 50);
    }
  }

  // get game state from the db
  loadGame(uid) {
    services.games.getGame(uid).then(res => {
      this.setState(prevState => {
        prevState.game = res.content;
        if (res.content.round === 'single') {
          prevState.board = res.content.single.categories;
        }
        if (res.content.round === 'double') {
          prevState.board = res.content.double.categories;
        }
        if (res.content.round === 'final') {
          prevState.question = res.content.final;
          prevState.question.loaded = true;
        }
        return prevState;
      });
    });
  }

  render() {
    const query = new URLSearchParams(this.props.location.search);
    const master = query.get('master');
    const q = query.get('q');
    const childProps = {
      services: services,
      board: this.state.board,
      final: this.state.question,
      round: this.state.round,
      master,
      shown: this.state.game.shown,
      multiplier:
        (this.state.game.round === 'double' ? 2 : 1) * kDollarMultiplier,
      contestants: this.state.game.contestants
    };

    if (
      this.state.question.loaded &&
      window.location.pathname.endsWith('board')
    ) {
      window.location = 'question?q=final&master=' + master;
    }
    let value;
    if (q != null && this.state.board.length > 0) {
      const qID = q;
      const qPerC = this.state.board[0].questions.length;
      value = (qID % qPerC) + 1; // value
    } else {
      value = null;
    }

    let bUrl = '/game/:gameUID';
    const { location } = this.props;
    return (
      <div id="game">
        <div id="game-content">
          <Router>
            <Switch>
              <Route
                strict={false}
                path={bUrl + '/board'}
                render={props => <Board {...props} {...childProps} />}
              />
              <Route
                strict={false}
                path={bUrl + '/question'}
                render={props => <Question {...props} {...childProps} />}
              />
              <Route
                strict={false}
                path={bUrl + '/gameover'}
                render={props => <GameOver {...props} {...childProps} />}
              />
              <Route
                strict={false}
                exact
                path={bUrl + '/'}
                render={() => (
                  <Redirect
                    to={{
                      ...location,
                      pathname: this.props.match.url + '/board'
                    }}
                  />
                )}
              />
              <Route strict={false} path="*" component={NotFound} />
            </Switch>
          </Router>
        </div>
        <Scores
          contestants={this.state.game.contestants}
          services={services}
          uid={this.props.match.params.gameUID}
          master={master}
          multiplier={
            (this.state.game.round === 'double' ? 2 : 1) * kDollarMultiplier
          }
          value={value}
        />
      </div>
    );
  }
}

export default withRouter(Game);
