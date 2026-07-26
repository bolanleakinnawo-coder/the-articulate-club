import React from "react";
import ArticulateClubHome from "./Articulate";

import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Journey from "./components/Journey";
import Admin from "./components/Admin";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<ArticulateClubHome />} />
      <Route path="/about" element={<About />} />
      <Route path="/journey" element={<Journey />} />
    </Routes>
  );
}

export default App;
