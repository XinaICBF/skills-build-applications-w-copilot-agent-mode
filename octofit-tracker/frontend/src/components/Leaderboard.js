import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // API endpoint: https://${CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || process.env.CODESPACE_NAME || 'bookish-spork-69pr97795jqv3rxp6';
        const baseUrl = codespace && codespace !== 'localhost'
          ? `https://${codespace}-8000.app.github.dev`
          : 'http://localhost:8000';
        
        const apiUrl = `${baseUrl}/api/leaderboard/`;
        console.log('Fetching leaderboard from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardList = data.results || data;
        setLeaderboard(Array.isArray(leaderboardList) ? leaderboardList : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading leaderboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Leaderboard</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>🏆 Leaderboard</h2>
      <p className="lead">Compete with others and climb to the top!</p>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <p className="mb-0">No leaderboard data available yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">User</th>
                <th scope="col">Team</th>
                <th scope="col">Total Points</th>
                <th scope="col">Activities</th>
                <th scope="col">Calories Burned</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id || index} className={index < 3 ? 'table-warning' : ''}>
                  <td>
                    {index === 0 && <span className="badge bg-warning text-dark">🥇 1</span>}
                    {index === 1 && <span className="badge bg-secondary">🥈 2</span>}
                    {index === 2 && <span className="badge bg-danger">🥉 3</span>}
                    {index > 2 && <strong>#{index + 1}</strong>}
                  </td>
                  <td><strong>{entry.user_name || entry.user}</strong></td>
                  <td>{entry.team_name || entry.team}</td>
                  <td>
                    <span className="badge bg-success">{entry.total_points} pts</span>
                  </td>
                  <td>{entry.total_activities}</td>
                  <td><strong>{entry.total_calories}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
