import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  EmojiEvents,
  Lock,
  CheckCircle,
  Close,
  Star,
  PhotoCamera,
  Psychology,
  Explore,
  Restaurant,
  Terrain,
  Speed,
  WorkspacePremium
} from '@mui/icons-material';

const AchievementsPanel = ({ userId, userProfile }) => {
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (userProfile && userProfile.achievements) {
      setAchievements(userProfile.achievements);
      setLoading(false);
    }
  }, [userProfile]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      beginner: <Star />,
      photo: <PhotoCamera />,
      trivia: <Psychology />,
      exploration: <Explore />,
      culture: <WorkspacePremium />,
      food: <Restaurant />,
      speed: <Speed />,
      completion: <EmojiEvents />
    };
    return icons[category] || <Star />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      beginner: '#4caf50',
      photo: '#2196f3',
      trivia: '#9c27b0',
      exploration: '#ff9800',
      culture: '#f5362e',
      food: '#ff5722',
      speed: '#ffeb3b',
      completion: '#ffd700'
    };
    return colors[category] || '#757575';
  };

  const getProgressForAchievement = (achievementId) => {
    // This would be calculated based on user's actual progress
    // For now, returning mock progress
    const progressMap = {
      first_quest: userProfile?.total_quests_completed >= 1 ? 100 : (userProfile?.total_quests_completed || 0) * 100,
      photo_master: Math.min((userProfile?.total_quests_completed || 0) * 20, 100),
      trivia_expert: Math.min((userProfile?.total_quests_completed || 0) * 10, 100),
      explorer: Math.min((userProfile?.total_quests_completed || 0) * 10, 100),
      culture_enthusiast: Math.min((userProfile?.total_quests_completed || 0) * 25, 100),
      foodie: Math.min((userProfile?.total_quests_completed || 0) * 25, 100),
      speed_runner: Math.min((userProfile?.total_quests_completed || 0) * 20, 100),
      completionist: Math.min((userProfile?.total_quests_completed || 0) * 5, 100)
    };
    return progressMap[achievementId] || 0;
  };

  const unlockedCount = achievements.filter(ach => ach.unlocked).length;
  const totalCount = achievements.length;

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
                Achievements
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {unlockedCount} of {totalCount} unlocked
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(unlockedCount / totalCount) * 100}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#77cbfe',
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          </Box>

          {/* Achievements Grid */}
          <Box sx={{ p: 3, height: 'calc(100% - 140px)', overflow: 'auto' }}>
            <Grid container spacing={2}>
              {achievements.map((achievement) => {
                const progress = getProgressForAchievement(achievement.id);
                const isUnlocked = achievement.unlocked;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: isUnlocked ? 'scale(1)' : 'scale(0.95)',
                        opacity: isUnlocked ? 1 : 0.7,
                        border: isUnlocked ? '2px solid #4caf50' : '2px solid transparent',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 3
                        }
                      }}
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isUnlocked 
                                ? getCategoryColor(achievement.category)
                                : '#e0e0e0',
                              color: 'white',
                              fontSize: '2rem',
                              position: 'relative'
                            }}
                          >
                            {isUnlocked ? (
                              achievement.icon
                            ) : (
                              <Lock sx={{ fontSize: '1.5rem' }} />
                            )}
                          </Box>
                          {isUnlocked && (
                            <CheckCircle
                              sx={{
                                position: 'absolute',
                                bottom: -5,
                                right: -5,
                                color: '#4caf50',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                fontSize: '1.2rem'
                              }}
                            />
                          )}
                        </Box>
                        
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold" 
                          gutterBottom
                          sx={{ 
                            color: isUnlocked ? 'text.primary' : 'text.secondary',
                            minHeight: '2.5em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {achievement.name}
                        </Typography>
                        
                        <Chip
                          label={achievement.category}
                          size="small"
                          sx={{
                            backgroundColor: isUnlocked 
                              ? getCategoryColor(achievement.category)
                              : '#e0e0e0',
                            color: 'white',
                            textTransform: 'capitalize',
                            fontSize: '0.7rem',
                            mb: 1
                          }}
                        />
                        
                        {!isUnlocked && progress > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getCategoryColor(achievement.category),
                                  borderRadius: 2,
                                }
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(progress)}% complete
                            </Typography>
                          </Box>
                        )}
                        
                        {achievement.unlocked_date && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Unlocked: {new Date(achievement.unlocked_date).toLocaleDateString()}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Achievement Detail Dialog */}
      <Dialog
        open={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: `linear-gradient(45deg, ${getCategoryColor(selectedAchievement.category)} 30%, ${getCategoryColor(selectedAchievement.category)}aa 90%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.5rem'
                  }}
                >
                  {selectedAchievement.unlocked ? selectedAchievement.icon : <Lock />}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedAchievement.name}
                  </Typography>
                  <Chip
                    label={selectedAchievement.category}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>
              <IconButton
                onClick={() => setSelectedAchievement(null)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Typography variant="body1" gutterBottom>
                {selectedAchievement.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {selectedAchievement.unlocked ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Achievement Unlocked!
                  </Typography>
                  {selectedAchievement.unlocked_date && (
                    <Typography variant="body2" color="text.secondary">
                      Unlocked on {new Date(selectedAchievement.unlocked_date).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Lock sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Not Yet Unlocked
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keep exploring to unlock this achievement!
                  </Typography>
                  
                  {getProgressForAchievement(selectedAchievement.id) > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressForAchievement(selectedAchievement.id)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getCategoryColor(selectedAchievement.category),
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {Math.round(getProgressForAchievement(selectedAchievement.id))}% complete
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AchievementsPanel;