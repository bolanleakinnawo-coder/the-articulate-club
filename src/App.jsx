import React from "react";
import ArticulateClubHome from "./Articulate";

import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Journey from "./components/Journey";
import Admin from "./components/Admin";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<ArticulateClubHome />} />
      <Route path="/about" element={<About />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
