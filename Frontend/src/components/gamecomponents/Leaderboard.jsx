import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  Person,
  Add
} from '@mui/icons-material';

const Leaderboard = ({ currentUserId, onUserCreate }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/users/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      } else {
        setError('Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUsername.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/users/profile?username=${encodeURIComponent(newUsername)}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setShowCreateUser(false);
        setNewUsername('');
        if (onUserCreate) {
          onUserCreate(userData);
        }
        fetchLeaderboard(); // Refresh leaderboard
      } else {
        setError('Failed to create user');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error creating user:', err);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: '#ffd700', fontSize: 28 }} />;
      case 2:
        return <EmojiEvents sx={{ color: '#c0c0c0', fontSize: 26 }} />;
      case 3:
        return <EmojiEvents sx={{ color: '#cd7f32', fontSize: 24 }} />;
      default:
        return (
          <Avatar sx={{ 
            bgcolor: '#072b80', 
            width: 32, 
            height: 32, 
            fontSize: '0.9rem' 
          }}>
            {rank}
          </Avatar>
        );
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(45deg, #ffd700 30%, #ffed4e 90%)';
      case 2:
        return 'linear-gradient(45deg, #c0c0c0 30%, #e8e8e8 90%)';
      case 3:
        return 'linear-gradient(45deg, #cd7f32 30%, #daa520 90%)';
      default:
        return 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)';
    }
  };

  const getAvatarColor = (username) => {
    // Generate consistent color based on username
    const colors = ['#f5362e', '#77cbfe', '#072b80', '#0484d6', '#4caf50', '#ff9800', '#9c27b0'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={fetchLeaderboard} variant="outlined">
              Retry
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ height: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0, height: '100%' }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EmojiEvents sx={{ fontSize: 32 }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Leaderboard
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Top adventurers in Sabah
            </Typography>
          </Box>

          {/* Leaderboard List */}
          <Box sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
            {leaderboardData.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No players yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Be the first to start your adventure!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowCreateUser(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
                  }}
                >
                  Join Adventure
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {leaderboardData.map((player, index) => (
                  <React.Fragment key={player.user_id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        background: player.user_id === currentUserId 
                          ? 'rgba(7, 43, 128, 0.1)' 
                          : 'transparent',
                        border: player.user_id === currentUserId 
                          ? '2px solid #072b80' 
                          : 'none',
                        borderRadius: player.user_id === currentUserId ? 1 : 0,
                        mx: player.user_id === currentUserId ? 1 : 0,
                        my: player.user_id === currentUserId ? 0.5 : 0,
                      }}
                    >
                      <ListItemAvatar>
                        {getRankIcon(player.rank)}
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                bgcolor: getAvatarColor(player.username),
                                width: 32,
                                height: 32,
                                fontSize: '0.9rem'
                              }}
                            >
                              {player.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {player.username}
                              {player.user_id === currentUserId && (
                                <Chip 
                                  label="You" 
                                  size="small" 
                                  sx={{ ml: 1, fontSize: '0.7rem' }}
                                />
                              )}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Chip
                              icon={<Star />}
                              label={`${player.total_points} pts`}
                              size="small"
                              sx={{
                                background: getRankColor(player.rank),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            <Chip
                              icon={<TrendingUp />}
                              label={`Level ${player.level}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < leaderboardData.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Add Player Button */}
          {leaderboardData.length > 0 && (
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setShowCreateUser(true)}
                sx={{ borderColor: '#072b80', color: '#072b80' }}
              >
                Join Adventure
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onClose={() => setShowCreateUser(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join the Adventure</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your adventurer profile to start exploring Sabah!
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateUser();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateUser(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!newUsername.trim()}
            sx={{
              background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
            }}
          >
            Create Profile
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Leaderboard;