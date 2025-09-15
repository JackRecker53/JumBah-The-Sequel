import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Star,
  EmojiEvents,
  TrendingUp,
  LocationOn,
  PhotoCamera,
  Quiz,
  Headphones,
  Close,
  Edit,
  Share,
  Download,
  Visibility,
  Lock,
  LockOpen
} from '@mui/icons-material';

const UserProfile = ({ userId, onClose }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/users/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQuestTypeIcon = (type) => {
    const icons = {
      location: <LocationOn />,
      photo: <PhotoCamera />,
      trivia: <Quiz />,
      audio: <Headphones />
    };
    return icons[type] || <Star />;
  };

  const getQuestTypeColor = (type) => {
    const colors = {
      location: '#4caf50',
      photo: '#2196f3',
      trivia: '#ff9800',
      audio: '#9c27b0'
    };
    return colors[type] || '#757575';
  };

  const getLevelInfo = (points) => {
    const level = Math.floor(points / 100) + 1;
    const currentLevelPoints = points % 100;
    const nextLevelPoints = 100;
    const progress = (currentLevelPoints / nextLevelPoints) * 100;
    
    return { level, currentLevelPoints, nextLevelPoints, progress };
  };

  const getAchievementsByCategory = () => {
    if (!userProfile?.achievements) return {};
    
    return userProfile.achievements.reduce((acc, achievement) => {
      const category = achievement.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(achievement);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!userProfile) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            User profile not found
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const levelInfo = getLevelInfo(userProfile.total_points);
  const achievementsByCategory = getAchievementsByCategory();

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
        color: 'white',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{ 
              width: 60, 
              height: 60, 
              backgroundColor: '#77cbfe',
              fontSize: 24,
              fontWeight: 'bold'
            }}
          >
            {userProfile.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {userProfile.username || 'Adventure Explorer'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Level {levelInfo.level} • {userProfile.total_points} points
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: 'white' }} onClick={() => setEditMode(true)}>
            <Edit />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Share />
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Stats Overview */}
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Grid container spacing={3}>
            {/* Level Progress */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Level Progress
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={levelInfo.progress}
                    size={80}
                    thickness={4}
                    sx={{
                      color: '#072b80',
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" component="div" color="text.secondary">
                      {levelInfo.level}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {levelInfo.currentLevelPoints} / {levelInfo.nextLevelPoints} XP
                </Typography>
              </Paper>
            </Grid>

            {/* Quest Stats */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Quest Statistics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EmojiEvents sx={{ color: '#ffd700' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Completed Quests" 
                      secondary={userProfile.completed_quests?.length || 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Star sx={{ color: '#072b80' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Total Points" 
                      secondary={userProfile.total_points || 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Current Level" 
                      secondary={levelInfo.level}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Achievement Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Achievements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {Object.entries(achievementsByCategory).map(([category, achievements]) => (
                    <Chip
                      key={category}
                      label={`${category} (${achievements.length})`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#072b80', 
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {userProfile.achievements?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Achievements
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Detailed Sections */}
        <Box sx={{ p: 3 }}>
          {/* Recent Achievements */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents sx={{ color: '#ffd700' }} />
            Recent Achievements
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {userProfile.achievements?.slice(0, 6).map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card sx={{ 
                  height: '100%',
                  border: '2px solid #ffd700',
                  '&:hover': { transform: 'scale(1.02)', transition: 'all 0.2s' }
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      backgroundColor: '#ffd700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: 24
                    }}>
                      🏆
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {achievement.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {achievement.description}
                    </Typography>
                    <Chip
                      label={achievement.category}
                      size="small"
                      sx={{ backgroundColor: '#072b80', color: 'white' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quest Completion History */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ color: '#4caf50' }} />
            Quest Completion History
          </Typography>
          
          <Paper sx={{ p: 2, mb: 4 }}>
            <List>
              {userProfile.completed_quests?.slice(0, 5).map((quest, index) => (
                <React.Fragment key={quest.quest_id}>
                  <ListItem>
                    <ListItemIcon>
                      {getQuestTypeIcon(quest.quest_type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Quest ${quest.quest_id}`}
                      secondary={`Completed on ${new Date(quest.completed_at).toLocaleDateString()} • ${quest.points_earned} points`}
                    />
                    <Chip
                      label={quest.quest_type}
                      size="small"
                      sx={{ 
                        backgroundColor: getQuestTypeColor(quest.quest_type),
                        color: 'white'
                      }}
                    />
                  </ListItem>
                  {index < userProfile.completed_quests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Unlocked Content Preview */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOpen sx={{ color: '#4caf50' }} />
            Unlocked Content
          </Typography>
          
          <Grid container spacing={2}>
            {userProfile.unlocked_content?.slice(0, 4).map((content) => (
              <Grid item xs={12} sm={6} md={3} key={content.content_id}>
                <Card sx={{ 
                  height: '100%',
                  '&:hover': { transform: 'scale(1.02)', transition: 'all 0.2s' }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px'
                    }}>
                      <LockOpen sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {content.content_type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Unlocked {new Date(content.unlocked_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;