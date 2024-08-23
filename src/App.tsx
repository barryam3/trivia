import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Init from "./Pages/Init";
import Game from "./Game";
import NotFound from "./Pages/NotFound";

function redirectTo(to: string) {
  function replacePath(
    nextState: { location: { pathname: string } },
    replace: (replacement: {}) => void
  ) {
    replace({
      pathname: to,
      state: { nextPathname: nextState.location.pathname },
    });
  }
  return replacePath;
}

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route
        strict={false}
        exact
        path="/"
        component={Init}
        // @ts-ignore: Unknown prop.
        onEnter={redirectTo("/init")}
      />
      <Route strict={false} path="/init" component={Init} />
      <Route strict={false} path="/game/:gameUID" component={Game} />
      <Route strict={false} path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
