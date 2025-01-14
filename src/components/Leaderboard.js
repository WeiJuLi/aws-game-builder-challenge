import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { state } = useLocation(); //Get data from navigate
  const { playerName, collisionCount } = state || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(
          "https://78v7hm3gld.execute-api.us-east-1.amazonaws.com/dev/leaderboard"
        );
        const result = await response.json();
        const leaderboardData = JSON.parse(result.body).topPlayers || [];
        setData(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <div className="user-info">
        <p>
          Your Name : <strong>{playerName}</strong>
        </p>
        <p>
          Your Collision Count : <strong>{collisionCount}</strong>
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Collision Times</th>
              </tr>
            </thead>
            <tbody>
              {data.map((player, index) => (
                <tr key={index} className="hover-row">
                  <td>{player.playerName}</td>
                  <td>{player.collisionTimes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;