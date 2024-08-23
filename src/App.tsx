import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Init from "./Pages/Init";
import Game from "./Game";
import NotFound from "./Pages/NotFound";

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route strict={false} exact path="/" component={Init} />
      <Route strict={false} path="/init" component={Init} />
      <Route strict={false} path="/game/:gameUID" component={Game} />
      <Route strict={false} path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
