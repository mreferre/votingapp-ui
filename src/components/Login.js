import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      data-testid="login-form"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2, borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '50%',
                p: 1.5,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Restaurant Voting App
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to cast your vote
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              data-testid="username-input"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              data-testid="password-input"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              data-testid="login-button"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
