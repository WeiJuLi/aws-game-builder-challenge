import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import GameCanvas from "./components/GameCanvas";
import GameOver from "./components/GameOver";
import DetectHand from "./components/HandDetectTest";
import LeaderBoard from "./components/Leaderboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<GameCanvas />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/detect" element={<DetectHand />} />
      </Routes>
    </Router>
  );
}

export default App;
