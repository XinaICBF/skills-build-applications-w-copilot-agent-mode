import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // API endpoint: https://${CODESPACE_NAME}-8000.app.github.dev/api/teams/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || process.env.CODESPACE_NAME || 'bookish-spork-69pr97795jqv3rxp6';
        const baseUrl = codespace && codespace !== 'localhost'
          ? `https://${codespace}-8000.app.github.dev`
          : 'http://localhost:8000';
        
        const apiUrl = `${baseUrl}/api/teams/`;
        console.log('Fetching teams from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsList = data.results || data;
        setTeams(Array.isArray(teamsList) ? teamsList : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading teams...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Teams</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
      <p className="lead">Join a team and achieve your fitness goals together</p>
      
      {teams.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <p className="mb-0">No teams available. Be the first to create one!</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="badge bg-primary">Total Teams: {teams.length}</span>
          </div>
          <div className="row">
            {teams.map((team) => (
              <div key={team.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <span className="badge bg-primary me-2">Team</span>
                      {team.name}
                    </h5>
                    <p className="card-text flex-grow-1">{team.description}</p>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        📅 {new Date(team.created_at).toLocaleDateString()}
                      </small>
                      {team.member_count !== undefined && (
                        <span className="badge bg-info text-dark">
                          👥 {team.member_count} members
                        </span>
                      )}
                    </div>
                    <button className="btn btn-primary mt-3 w-100">View Team</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Teams;
