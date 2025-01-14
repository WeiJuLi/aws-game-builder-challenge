import React, { useState } from "react";
import './EndGameModal.css';

function EndGameModal({ collisionCount, onSubmit }) {
    const [playerName, setPlayerName] = useState("");

    const handleSubmit = () => {
        if (playerName.trim()) {
            onSubmit(playerName);
        }
    };

    return (
        <div className="modal">
            <h1>Game Over</h1>
            <p>Collision Count : {collisionCount}</p>
            <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}    
            />
            <button onClick={handleSubmit} disabled={!playerName.trim()}>
                Submit to Leaderboard
            </button>
        </div>
    );
}

export default EndGameModal;