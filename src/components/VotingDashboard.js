import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LogoutIcon from '@mui/icons-material/Logout';

const API_BASE = process.env.REACT_APP_VOTINGAPP_ENDPOINT || '';

const RESTAURANTS = [
  { key: 'outback', name: 'Outback Steakhouse', emoji: '\uD83E\uDD69', color: '#d32f2f' },
  { key: 'bucadibeppo', name: 'Buca di Beppo', emoji: '\uD83C\uDF5D', color: '#388e3c' },
  { key: 'ihop', name: 'IHOP', emoji: '\uD83E\uDD5E', color: '#1565c0' },
  { key: 'chipotle', name: 'Chipotle', emoji: '\uD83C\uDF2F', color: '#e65100' },
];

const VotingDashboard = ({ onLogout }) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const fetchVotes = useCallback(async () => {
    try {
      const res = await fetch(API_BASE + '/api/getvotes');
      if (!res.ok) throw new Error('Failed to fetch votes');
      const data = await res.json();
      setVotes(data);
    } catch (err) {
      alert('Error fetching votes: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const handleVote = async (restaurantKey) => {
    setVoting(restaurantKey);
    try {
      const res = await fetch(API_BASE + '/api/' + restaurantKey);
      if (!res.ok) throw new Error('Vote request failed');
      await res.text();
      await fetchVotes();
      const restaurant = RESTAURANTS.find((r) => r.key === restaurantKey);
      setSnackbar({
        open: true,
        message: 'Voted for ' + (restaurant ? restaurant.name : restaurantKey) + '!',
      });
    } catch (err) {
      alert('Error voting: ' + err.message);
    } finally {
      setVoting(null);
    }
  };

  const getVoteCount = (key) => {
    const vote = votes.find((v) => v.name === key);
    return vote ? vote.value : 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <Box data-testid="dashboard" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Restaurant Voting App
          </Typography>
          <Button
            data-testid="logout-button"
            color="inherit"
            onClick={onLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3, mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {RESTAURANTS.map((restaurant) => (
              <Grid item xs={12} sm={6} md={3} key={restaurant.key}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: restaurant.color,
                      py: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h3" component="div">
                      {restaurant.emoji}
                    </Typography>
                  </Box>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {restaurant.name}
                    </Typography>
                    <Typography
                      data-testid={'vote-count-' + restaurant.key}
                      variant="h3"
                      fontWeight="bold"
                      color={restaurant.color}
                    >
                      {getVoteCount(restaurant.key)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      votes
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      data-testid={'vote-button-' + restaurant.key}
                      variant="contained"
                      startIcon={<HowToVoteIcon />}
                      disabled={voting === restaurant.key}
                      onClick={() => handleVote(restaurant.key)}
                      sx={{
                        bgcolor: restaurant.color,
                        '&:hover': { bgcolor: restaurant.color, filter: 'brightness(0.85)' },
                        borderRadius: 2,
                        fontWeight: 'bold',
                        px: 3,
                      }}
                    >
                      {voting === restaurant.key ? 'Voting...' : 'Vote'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VotingDashboard;
