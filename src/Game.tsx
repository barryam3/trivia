import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useParams,
} from "react-router-dom";

import Scores from "./Elements/Scores";
import Board from "./Pages/Board";
import Question, { Final } from "./Pages/Question";
import GameOver from "./Pages/GameOver";
import services from "./services/index";
import NotFound from "./Pages/NotFound";
import { Game as IGame, Category } from "./interfaces/game";

// Dollar value of the lowest-value question
// 200 for classic Jeopardy
const kDollarMultiplier = 2;

// repeatedly try function f every ddt msec for dt msec
function tryUntil(f: Function, dt: number, ddt: number) {
  f();
  if (dt > 0) {
    setTimeout(() => tryUntil(f, dt - ddt, ddt), ddt);
  }
}

interface Params {
  gameUID: string;
}

interface State {
  game: IGame;
  board: Category[];
  question: Final;
  lastScreen: string;
}

const Game: React.FC = () => {
  const [state, setState] = useState<State>({
    game: {
      uid: "",
      round: "",
      contestants: [],
      single: {
        categories: [],
        earlyend: 0,
      },
      double: {
        categories: [],
        earlyend: 0,
      },
      final: {
        category: "",
        question: "",
        answer: "",
      },
      screen: "",
      shown: 0,
    }, // all of the state
    board: [], // single vs double jeopardy
    question: {
      category: "",
      question: "",
      answer: "",
      loaded: false,
    }, // for final jeopardy
    lastScreen: "",
  });

  const params = useParams<Params>();
  const location = useLocation();

  useEffect(() => {
    // for follower: check for updates to screen state to see if page must be reloaded
    const checkForUpdates = () => {
      services.games.getGame(params.gameUID).then((res) => {
        if (!window.location.href.endsWith(res.content.screen)) {
          window.location.assign(res.content.screen);
        }
        setState((prevState) => ({ ...prevState, game: res.content }));
      });
    };

    const query = new URLSearchParams(location.search);
    const leader = query.get("leader");
    loadGame(params.gameUID);
    if (leader !== "true" && !window.location.pathname.includes("gameover")) {
      tryUntil(checkForUpdates, Infinity, 50);
    }
  }, [location.search, params.gameUID]);

  // get game state from the db
  const loadGame = (uid: string) => {
    services.games.getGame(uid).then((res) => {
      setState((prevState) => {
        const newState = JSON.parse(JSON.stringify(prevState));
        newState.game = res.content;
        if (res.content.round === "single") {
          newState.board = res.content.single.categories;
        }
        if (res.content.round === "double") {
          newState.board = res.content.double.categories;
        }
        if (res.content.round === "final") {
          newState.question = res.content.final;
          newState.question.loaded = true;
        }
        return newState;
      });
    });
  };

  const query = new URLSearchParams(location.search);
  const leader = Boolean(query.get("leader"));
  const q = query.get("q");
  const childProps = {
    services: services,
    board: state.board,
    final: state.question,
    round: state.game.round,
    leader,
    shown: state.game.shown,
    multiplier: (state.game.round === "double" ? 2 : 1) * kDollarMultiplier,
    contestants: state.game.contestants,
  };

  if (state.question.loaded && window.location.pathname.endsWith("board")) {
    window.location.assign("question?q=final&leader=" + leader);
  }
  let value;
  if (q != null && state.board.length > 0) {
    const qID = Number(q);
    const qPerC = state.board[0].questions.length;
    value = (qID % qPerC) + 1; // value
  } else {
    value = null;
  }

  let bUrl = "/game/:gameUID";
  return (
    <div id="game">
      <div id="game-content">
        <Router>
          <Switch>
            <Route
              strict={false}
              path={bUrl + "/board"}
              children={<Board {...childProps} />}
            />
            <Route
              strict={false}
              path={bUrl + "/question"}
              children={<Question {...childProps} />}
            />
            <Route
              strict={false}
              path={bUrl + "/gameover"}
              children={<GameOver {...childProps} />}
            />
            <Route
              strict={false}
              exact
              path={bUrl + "/"}
              render={() => (
                <Redirect
                  to={{
                    ...location,
                    pathname: match.url + "/board",
                  }}
                />
              )}
            />
            <Route strict={false} path="*" children={<NotFound />} />
          </Switch>
        </Router>
      </div>
      <Scores
        contestants={state.game.contestants}
        uid={params.gameUID}
        leader={leader}
        multiplier={(state.game.round === "double" ? 2 : 1) * kDollarMultiplier}
        value={value}
      />
    </div>
  );
};

export default Game;
