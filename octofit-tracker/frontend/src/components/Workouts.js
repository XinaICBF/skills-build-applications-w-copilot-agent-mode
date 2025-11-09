import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // API endpoint: https://${CODESPACE_NAME}-8000.app.github.dev/api/workouts/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || process.env.CODESPACE_NAME || 'bookish-spork-69pr97795jqv3rxp6';
        const baseUrl = codespace && codespace !== 'localhost'
          ? `https://${codespace}-8000.app.github.dev`
          : 'http://localhost:8000';
        
        const apiUrl = `${baseUrl}/api/workouts/`;
        console.log('Fetching workouts from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsList = data.results || data;
        setWorkouts(Array.isArray(workoutsList) ? workoutsList : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading workouts...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Workouts</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getDifficultyBadge = (level) => {
    const badges = {
      'Easy': 'success',
      'Medium': 'warning',
      'Hard': 'danger',
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'danger'
    };
    return badges[level] || 'secondary';
  };

  return (
    <div className="container mt-4">
      <h2>Personalized Workouts</h2>
      <p className="lead">Customized workout plans tailored to your fitness level</p>
      
      {workouts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <p className="mb-0">No workouts available. Check back soon for personalized recommendations!</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="badge bg-primary">Available Workouts: {workouts.length}</span>
          </div>
          <div className="row">
            {workouts.map((workout) => (
              <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <span className="badge bg-primary me-2">💪</span>
                      {workout.name}
                    </h5>
                    <p className="card-text flex-grow-1">{workout.description}</p>
                    <hr />
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Type:</strong>
                        <span className="badge bg-info text-dark">{workout.workout_type}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Duration:</strong>
                        <span className="badge bg-secondary">{workout.duration} min</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Difficulty:</strong>
                        <span className={`badge bg-${getDifficultyBadge(workout.difficulty_level)}`}>
                          {workout.difficulty_level}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Target:</strong>
                        <span className="badge bg-success">{workout.calories_target} cal</span>
                      </li>
                    </ul>
                    {workout.user && (
                      <p className="card-text">
                        <small className="text-muted">👤 For: {workout.user_name || workout.user}</small>
                      </p>
                    )}
                    <button className="btn btn-primary w-100 mt-2">Start Workout</button>
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

export default Workouts;
