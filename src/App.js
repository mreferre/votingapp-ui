import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './components/Login';
import VotingDashboard from './components/VotingDashboard';
import './App.css';

const VOTINGAPP_ENDPOINT = process.env.REACT_APP_VOTINGAPP_ENDPOINT;
if (!VOTINGAPP_ENDPOINT) {
  console.warn(
    'REACT_APP_VOTINGAPP_ENDPOINT environment variable is not set. Please set this variable in your .env file.'
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {isAuthenticated ? (
        <VotingDashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;
