import App from './App.jsx';
import NotFound from './Pages/NotFound.jsx';
import Init from './Pages/Init.jsx';
import Game from './Game.jsx';
import Board from './Pages/Board.jsx';
import Question from './Pages/Question.jsx';
import GameOver from './Pages/GameOver.jsx';
import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory,
  Redirect
} from 'react-router';

function redirectTo(to) {
  function replacePath(nextState, replace) {
    replace({
      pathname: to,
      state: { nextPathname: nextState.location.pathname }
    });
  }
  return replacePath;
}

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Init} onEnter={redirectTo('/init')} />
      <Route path="init" component={Init} />
      <Route path="game/:gameUID" component={Game}>
        <Route path="board" component={Board} />
        <Route path="question" component={Question} />
        <Route path="gameover" component={GameOver} />
        <IndexRoute component={Board} render={() => <Redirect to="board" />} />
      </Route>
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
