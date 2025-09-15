import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Lock,
  LockOpen,
  Article,
  PlayCircle,
  Restaurant,
  CardGiftcard,
  Close,
  Star,
  AccessTime,
  Person,
  Visibility,
  Download
} from '@mui/icons-material';

const UnlockableContent = ({ userProfile, onContentUnlock }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentData, setContentData] = useState({
    articles: [],
    videos: [],
    recipes: [],
    souvenirs: []
  });

  useEffect(() => {
    // Initialize content data
    setContentData({
      articles: [
        {
          id: 'article-1',
          title: 'The Hidden Gems of Kota Kinabalu',
          description: 'Discover secret spots that only locals know about in Sabah\'s capital city.',
          author: 'Sarah Chen',
          readTime: '5 min read',
          category: 'Travel Guide',
          unlockRequirement: 'Complete 3 cultural quests',
          requiredPoints: 150,
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
          content: 'Detailed article content about hidden gems...',
          unlocked: (userProfile?.total_points || 0) >= 150
        },
        {
          id: 'article-2',
          title: 'Mount Kinabalu: A Climber\'s Guide',
          description: 'Everything you need to know before attempting Malaysia\'s highest peak.',
          author: 'Adventure Team',
          readTime: '8 min read',
          category: 'Adventure',
          unlockRequirement: 'Complete Mount Kinabalu quest',
          requiredPoints: 500,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          content: 'Comprehensive climbing guide...',
          unlocked: (userProfile?.total_points || 0) >= 500
        }
      ],
      videos: [
        {
          id: 'video-1',
          title: 'Sabah Wildlife Documentary',
          description: 'A stunning 20-minute documentary showcasing Sabah\'s incredible biodiversity.',
          duration: '20:15',
          category: 'Nature',
          unlockRequirement: 'Complete 5 nature quests',
          requiredPoints: 250,
          thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
          videoUrl: 'https://example.com/video1.mp4',
          unlocked: (userProfile?.total_points || 0) >= 250
        },
        {
          id: 'video-2',
          title: 'Traditional Sabahan Dances',
          description: 'Learn about the rich cultural heritage through traditional performances.',
          duration: '15:30',
          category: 'Culture',
          unlockRequirement: 'Complete all cultural quests',
          requiredPoints: 400,
          thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
          videoUrl: 'https://example.com/video2.mp4',
          unlocked: (userProfile?.total_points || 0) >= 400
        }
      ],
      recipes: [
        {
          id: 'recipe-1',
          title: 'Authentic Hinava Recipe',
          description: 'Traditional Kadazan-Dusun raw fish salad with lime and chili.',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          category: 'Traditional',
          unlockRequirement: 'Complete 3 food quests',
          requiredPoints: 180,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          ingredients: ['Fresh fish', 'Lime juice', 'Chili', 'Onions', 'Ginger'],
          instructions: 'Step-by-step cooking instructions...',
          unlocked: (userProfile?.total_points || 0) >= 180
        },
        {
          id: 'recipe-2',
          title: 'Bambangan Pickle',
          description: 'Sweet and sour pickle made from wild mango, a Sabahan delicacy.',
          difficulty: 'Easy',
          cookTime: '45 minutes',
          category: 'Snacks',
          unlockRequirement: 'Complete local market quest',
          requiredPoints: 120,
          image: 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=400',
          ingredients: ['Wild mango', 'Sugar', 'Salt', 'Chili flakes'],
          instructions: 'Traditional pickle preparation...',
          unlocked: (userProfile?.total_points || 0) >= 120
        }
      ],
      souvenirs: [
        {
          id: 'souvenir-1',
          title: 'Digital Sabah Flag Badge',
          description: 'A beautiful digital badge featuring the Sabah state flag.',
          category: 'Badge',
          unlockRequirement: 'Complete first quest',
          requiredPoints: 50,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
          rarity: 'Common',
          unlocked: (userProfile?.total_points || 0) >= 50
        },
        {
          id: 'souvenir-2',
          title: 'Mount Kinabalu Certificate',
          description: 'Virtual certificate commemorating your Mount Kinabalu adventure.',
          category: 'Certificate',
          unlockRequirement: 'Complete Mount Kinabalu quest',
          requiredPoints: 500,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          rarity: 'Legendary',
          unlocked: (userProfile?.total_points || 0) >= 500
        },
        {
          id: 'souvenir-3',
          title: 'Orangutan Plushie Avatar',
          description: 'Adorable digital orangutan avatar for your profile.',
          category: 'Avatar',
          unlockRequirement: 'Complete wildlife photography quest',
          requiredPoints: 300,
          image: 'https://images.unsplash.com/photo-1605656816944-971cd5c1407f?w=400',
          rarity: 'Rare',
          unlocked: (userProfile?.total_points || 0) >= 300
        }
      ]
    });
  }, [userProfile]);

  const tabLabels = ['Articles', 'Videos', 'Recipes', 'Souvenirs'];
  const tabIcons = [<Article key="article" />, <PlayCircle key="video" />, <Restaurant key="recipe" />, <CardGiftcard key="souvenir" />];

  const getCurrentTabData = () => {
    const keys = ['articles', 'videos', 'recipes', 'souvenirs'];
    return contentData[keys[selectedTab]] || [];
  };

  const getRarityColor = (rarity) => {
    const colors = {
      Common: '#4caf50',
      Rare: '#2196f3',
      Epic: '#9c27b0',
      Legendary: '#ff9800'
    };
    return colors[rarity] || '#757575';
  };

  const handleUnlockContent = async (content) => {
    if (content.unlocked) return;
    
    try {
      // Call backend to unlock content
      const response = await fetch(`http://localhost:8000/api/users/profile/${userProfile.user_id}/unlock-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_id: content.id }),
      });
      
      if (response.ok && onContentUnlock) {
        onContentUnlock(content.id);
      }
    } catch (err) {
      console.error('Error unlocking content:', err);
    }
  };

  const ContentCard = ({ content, type }) => {
    const isUnlocked = content.unlocked;
    const canUnlock = (userProfile?.total_points || 0) >= content.requiredPoints;
    
    return (
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          opacity: isUnlocked ? 1 : 0.7,
          transform: isUnlocked ? 'scale(1)' : 'scale(0.98)',
          border: isUnlocked ? '2px solid #4caf50' : '2px solid transparent',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 3
          }
        }}
        onClick={() => setSelectedContent({ ...content, type })}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={content.image || content.thumbnail}
            alt={content.title}
            sx={{ 
              filter: isUnlocked ? 'none' : 'grayscale(100%) blur(2px)',
            }}
          />
          {!isUnlocked && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <Lock sx={{ fontSize: 48, color: 'white' }} />
            </Box>
          )}
          {isUnlocked && (
            <Chip
              icon={<LockOpen />}
              label="Unlocked"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: '#4caf50',
                color: 'white'
              }}
            />
          )}
        </Box>
        
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {content.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {content.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={content.category}
              size="small"
              sx={{ backgroundColor: '#072b80', color: 'white' }}
            />
            {content.rarity && (
              <Chip
                label={content.rarity}
                size="small"
                sx={{ 
                  backgroundColor: getRarityColor(content.rarity),
                  color: 'white'
                }}
              />
            )}
            {content.difficulty && (
              <Chip
                label={content.difficulty}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          
          {!isUnlocked && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {content.unlockRequirement}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(((userProfile?.total_points || 0) / content.requiredPoints) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: canUnlock ? '#4caf50' : '#072b80',
                    borderRadius: 3,
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {userProfile?.total_points || 0} / {content.requiredPoints} points
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {type === 'articles' && content.readTime && (
              <Chip
                icon={<AccessTime />}
                label={content.readTime}
                size="small"
                variant="outlined"
              />
            )}
            {type === 'videos' && content.duration && (
              <Chip
                icon={<PlayCircle />}
                label={content.duration}
                size="small"
                variant="outlined"
              />
            )}
            {type === 'recipes' && content.cookTime && (
              <Chip
                icon={<AccessTime />}
                label={content.cookTime}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

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
              <CardGiftcard sx={{ fontSize: 32 }} />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Unlockable Content
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Complete quests to unlock exclusive content
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={label}
                icon={tabIcons[index]}
                label={label}
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
            ))}
          </Tabs>

          {/* Content Grid */}
          <Box sx={{ p: 3, height: 'calc(100% - 200px)', overflow: 'auto' }}>
            <Grid container spacing={3}>
              {getCurrentTabData().map((content) => (
                <Grid item xs={12} sm={6} md={4} key={content.id}>
                  <ContentCard 
                    content={content} 
                    type={['articles', 'videos', 'recipes', 'souvenirs'][selectedTab]}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Content Detail Dialog */}
      <Dialog
        open={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedContent && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
              color: 'white'
            }}>
              <Typography variant="h6">{selectedContent.title}</Typography>
              <IconButton
                onClick={() => setSelectedContent(null)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <CardMedia
                component="img"
                height="300"
                image={selectedContent.image || selectedContent.thumbnail}
                alt={selectedContent.title}
              />
              
              <Box sx={{ p: 3 }}>
                <Typography variant="body1" gutterBottom>
                  {selectedContent.description}
                </Typography>
                
                {selectedContent.type === 'recipes' && selectedContent.ingredients && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Ingredients
                    </Typography>
                    <List dense>
                      {selectedContent.ingredients.map((ingredient, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Star sx={{ fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText primary={ingredient} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                {selectedContent.unlocked ? (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Visibility />}
                      sx={{
                        background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
                        mr: 2
                      }}
                    >
                      {selectedContent.type === 'videos' ? 'Watch Now' : 'View Content'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Download />}
                    >
                      Download
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ mt: 3, textAlign: 'center', p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                    <Lock sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Content Locked
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedContent.unlockRequirement}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((userProfile?.total_points || 0) / selectedContent.requiredPoints) * 100, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#072b80',
                          borderRadius: 4,
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {userProfile?.total_points || 0} / {selectedContent.requiredPoints} points
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default UnlockableContent;