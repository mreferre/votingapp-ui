import React, { useState, useCallback } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const VOTINGAPP_ENDPOINT = process.env.REACT_APP_VOTINGAPP_ENDPOINT || '';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = useCallback((username) => {
    setUser(username);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      apiEndpoint={VOTINGAPP_ENDPOINT}
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;
