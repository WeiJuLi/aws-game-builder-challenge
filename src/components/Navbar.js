import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <div class="image">
        <Link to="/"><img src="/assets/logo.png" alt="Game Logo" /></Link>
      </div>
      <Link to="/">Retry</Link>
      <Link to="/leaderboard">Leaderboard</Link>
    </nav>
  );
}

export default Navbar;
