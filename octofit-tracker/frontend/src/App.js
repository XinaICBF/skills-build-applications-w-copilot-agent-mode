import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit Logo" />
              OctoFit Tracker
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mt-4">
              <div className="text-center mb-5">
                <h1>Welcome to OctoFit Tracker 🏃‍♂️</h1>
                <p className="lead">Track your fitness activities, compete with teams, and achieve your goals!</p>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-4 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="display-4 mb-3">📊</div>
                      <h5 className="card-title">Track Activities</h5>
                      <p className="card-text">Log your workouts and monitor your progress over time.</p>
                      <Link to="/activities" className="btn btn-primary">View Activities</Link>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="display-4 mb-3">🏆</div>
                      <h5 className="card-title">Compete</h5>
                      <p className="card-text">Check the leaderboard and see how you rank against others.</p>
                      <Link to="/leaderboard" className="btn btn-primary">View Leaderboard</Link>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="display-4 mb-3">👥</div>
                      <h5 className="card-title">Join Teams</h5>
                      <p className="card-text">Connect with others and achieve fitness goals together.</p>
                      <Link to="/teams" className="btn btn-primary">View Teams</Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-6 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="display-4 mb-3">👤</div>
                      <h5 className="card-title">Connect with Users</h5>
                      <p className="card-text">View and connect with fellow fitness enthusiasts.</p>
                      <Link to="/users" className="btn btn-primary">View Users</Link>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="display-4 mb-3">💪</div>
                      <h5 className="card-title">Personalized Workouts</h5>
                      <p className="card-text">Get customized workout plans based on your fitness level.</p>
                      <Link to="/workouts" className="btn btn-primary">View Workouts</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
