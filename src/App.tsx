import type React from "react";
import { createBrowserRouter, replace } from "react-router";
import { RouterProvider } from "react-router/dom";
import Init from "./Pages/Init";
import Board from "./Pages/Board";
import Question from "./Pages/Question";
import GameOver from "./Pages/GameOver";
import Game from "./Game";
import NotFound from "./Pages/NotFound";
import Category from "./Pages/Category";
import Config from "./Pages/Config";

const router = createBrowserRouter(
  [
    {
      path: "/",
      loader: () => replace("init"),
    },
    {
      path: "/init",
      element: <Init />,
    },
    {
      path: "/config",
      element: <Config />,
    },
    {
      path: "/game/:gameUID",
      element: <Game />,
      children: [
        // If the user loads "/game/:gameUID" default to round 1.
        {
          path: "",
          loader: () => replace(`1${window.location.search}`),
        },
        {
          path: ":round",
          children: [
            {
              path: "",
              element: <Board />,
            },
            {
              path: ":category",
              children: [
                {
                  path: "",
                  element: <Category />,
                },
                ...["", ":stage"].map((optionalStage) => ({
                  path: `:question/${optionalStage}`,
                  element: <Question />,
                })),
              ],
            },
          ],
        },
        {
          path: "gameover",
          element: <GameOver />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  // Enable all future flags to minimize churn in the future.
  {
    future: {
    },
    // https://github.com/rafgraph/spa-github-pages
    basename: window.location.href.includes("github.io") ? "/trivia" : "/",
  }
);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
