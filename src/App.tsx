import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Init from "./Pages/Init";
import Game from "./Game";
import NotFound from "./Pages/NotFound";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Init />} />
      <Route path="/init" element={<Init />} />
      <Route path="/game/:gameUID/*" element={<Game />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
