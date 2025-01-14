import React from "react";
import { useNavigate } from "react-router-dom";

function GameOver() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/"); // Navigate back to GameCanvas
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Game Over</h1>
      <button onClick={handleRetry} style={{ padding: "10px 20px", fontSize: "18px" }}>
        Retry
      </button>
    </div>
  );
}

export default GameOver;
