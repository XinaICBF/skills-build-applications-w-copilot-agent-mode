import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // API endpoint: https://${CODESPACE_NAME}-8000.app.github.dev/api/activities/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || process.env.CODESPACE_NAME || 'bookish-spork-69pr97795jqv3rxp6';
        const baseUrl = codespace && codespace !== 'localhost'
          ? `https://${codespace}-8000.app.github.dev`
          : 'http://localhost:8000';
        
        const apiUrl = `${baseUrl}/api/activities/`;
        console.log('Fetching activities from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesList = data.results || data;
        setActivities(Array.isArray(activitiesList) ? activitiesList : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading activities...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Activities</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Activity Tracker</h2>
      <p className="lead">Track all your fitness activities and monitor your progress</p>
      
      {activities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <p className="mb-0">No activities found. Start logging your workouts!</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="badge bg-primary">Total Activities: {activities.length}</span>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">User</th>
                  <th scope="col">Activity Type</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Distance (km)</th>
                  <th scope="col">Calories</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td><strong>#{activity.id}</strong></td>
                    <td>{activity.user_name || activity.user}</td>
                    <td>
                      <span className="badge bg-info text-dark">{activity.activity_type}</span>
                    </td>
                    <td>{activity.duration}</td>
                    <td>{activity.distance}</td>
                    <td><strong>{activity.calories_burned}</strong></td>
                    <td>{new Date(activity.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Activities;
