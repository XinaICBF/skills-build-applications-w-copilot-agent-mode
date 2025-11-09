import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // API endpoint: https://${CODESPACE_NAME}-8000.app.github.dev/api/users/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || process.env.CODESPACE_NAME || 'bookish-spork-69pr97795jqv3rxp6';
        const baseUrl = codespace && codespace !== 'localhost'
          ? `https://${codespace}-8000.app.github.dev`
          : 'http://localhost:8000';
        
        const apiUrl = `${baseUrl}/api/users/`;
        console.log('Fetching users from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersList = data.results || data;
        setUsers(Array.isArray(usersList) ? usersList : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Users</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Users Directory</h2>
      <p className="lead">Connect with fellow fitness enthusiasts</p>
      
      {users.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <p className="mb-0">No users found.</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="badge bg-primary">Total Users: {users.length}</span>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Team</th>
                  <th scope="col">Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>#{user.id}</strong></td>
                    <td>
                      <span className="badge bg-secondary">👤</span> {user.username}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.team_name || user.team ? (
                        <span className="badge bg-info text-dark">{user.team_name || user.team}</span>
                      ) : (
                        <span className="text-muted">No team</span>
                      )}
                    </td>
                    <td>{new Date(user.date_joined).toLocaleDateString()}</td>
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

export default Users;
