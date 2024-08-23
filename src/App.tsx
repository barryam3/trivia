import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Init from "./Pages/Init";
import Game from "./Game";
import NotFound from "./Pages/NotFound";

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route strict={false} exact path="/" children={<Init />} />
      <Route strict={false} path="/init" children={<Init />} />
      <Route strict={false} path="/game/:gameUID" children={<Game />} />
      <Route strict={false} path="*" children={<NotFound />} />
    </Switch>
  </Router>
);

export default App;
