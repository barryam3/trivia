import type React from "react";
import { createBrowserRouter, RouterProvider, replace } from "react-router-dom";
import Init from "./Pages/Init";
import Board from "./Pages/Board";
import Question from "./Pages/Question";
import GameOver from "./Pages/GameOver";
import Game from "./Game";
import NotFound from "./Pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => replace("init"),
  },
  {
    path: "/init",
    element: <Init />,
  },
  {
    path: "/game/:gameUID/*",
    element: <Game />,
    children: [
      {
        path: "",
        loader: () => replace(`board${window.location.search}`),
      },
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "question",
        element: <Question />,
      },
      {
        path: "gameover",
        element: <GameOver />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
