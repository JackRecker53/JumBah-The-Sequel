import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Share,
  Facebook,
  Twitter,
  Instagram,
  WhatsApp,
  ContentCopy,
  Download,
  Close,
  PhotoCamera,
  EmojiEvents
} from '@mui/icons-material';

const SocialSharing = ({ 
  open, 
  onClose, 
  shareType = 'achievement', // 'achievement', 'photo', 'progress'
  shareData = {},
  userProfile = {}
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const generateShareContent = () => {
    const baseUrl = window.location.origin;
    const appName = "Sabah Adventure Quests";
    
    switch (shareType) {
      case 'achievement':
        return {
          title: `🏆 Achievement Unlocked: ${shareData.name}!`,
          description: `I just unlocked the "${shareData.name}" achievement in ${appName}! ${shareData.description}`,
          hashtags: ['SabahAdventure', 'Achievement', 'Travel', 'Malaysia'],
          url: `${baseUrl}/achievements`
        };
      
      case 'photo':
        return {
          title: `📸 Amazing shot from ${shareData.location}!`,
          description: `Check out this incredible photo I captured during my ${appName} adventure in ${shareData.location}! ${customMessage}`,
          hashtags: ['SabahAdventure', 'Photography', 'Travel', 'Malaysia', 'Nature'],
          url: `${baseUrl}/gallery`
        };
      
      case 'progress':
        return {
          title: `🎯 Level ${userProfile.level} Adventurer!`,
          description: `I've completed ${userProfile.total_quests_completed} quests and earned ${userProfile.total_points} points in ${appName}! Join me in exploring beautiful Sabah! 🌴`,
          hashtags: ['SabahAdventure', 'Travel', 'Malaysia', 'Adventure'],
          url: `${baseUrl}/leaderboard`
        };
      
      default:
        return {
          title: `🌴 Exploring Sabah with ${appName}!`,
          description: `Join me on an amazing adventure through Sabah, Malaysia! Discover hidden gems, complete quests, and unlock achievements! ${customMessage}`,
          hashtags: ['SabahAdventure', 'Travel', 'Malaysia'],
          url: baseUrl
        };
    }
  };

  const shareContent = generateShareContent();

  const handleShare = (platform) => {
    const { title, description, hashtags, url } = shareContent;
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    const fullMessage = `${title}\n\n${description}\n\n${hashtagString}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(fullMessage)}`;
        break;
      
      case 'twitter':
        const twitterMessage = `${title}\n\n${description}\n\n${hashtagString}`;
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}&url=${encodeURIComponent(url)}`;
        break;
      
      case 'whatsapp':
        const whatsappMessage = `${fullMessage}\n\n${url}`;
        shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        break;
      
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        handleCopyToClipboard();
        return;
      
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyToClipboard = async () => {
    const { title, description, hashtags, url } = shareContent;
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    const fullMessage = `${title}\n\n${description}\n\n${hashtagString}\n\n${url}`;
    
    try {
      await navigator.clipboard.writeText(fullMessage);
      setShowCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareContent.title,
          text: shareContent.description,
          url: shareContent.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const getShareIcon = () => {
    switch (shareType) {
      case 'achievement':
        return <EmojiEvents sx={{ fontSize: 40, color: '#ffd700' }} />;
      case 'photo':
        return <PhotoCamera sx={{ fontSize: 40, color: '#2196f3' }} />;
      case 'progress':
        return <EmojiEvents sx={{ fontSize: 40, color: '#4caf50' }} />;
      default:
        return <Share sx={{ fontSize: 40, color: '#072b80' }} />;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Share />
            <Typography variant="h6">Share Your Adventure</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {/* Preview Card */}
          <Card sx={{ mb: 3, border: '2px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getShareIcon()}
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {shareContent.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {shareContent.hashtags.map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        size="small"
                        sx={{ 
                          backgroundColor: '#072b80',
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {shareContent.description}
              </Typography>
              
              {shareType === 'photo' && (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Add a personal message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}
              
              <Typography variant="caption" color="primary">
                {shareContent.url}
              </Typography>
            </CardContent>
          </Card>

          <Divider sx={{ mb: 3 }} />

          {/* Social Media Buttons */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Share on Social Media
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleShare('facebook')}
              sx={{
                borderColor: '#1877f2',
                color: '#1877f2',
                '&:hover': {
                  backgroundColor: '#1877f2',
                  color: 'white'
                }
              }}
            >
              Facebook
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Twitter />}
              onClick={() => handleShare('twitter')}
              sx={{
                borderColor: '#1da1f2',
                color: '#1da1f2',
                '&:hover': {
                  backgroundColor: '#1da1f2',
                  color: 'white'
                }
              }}
            >
              Twitter
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<WhatsApp />}
              onClick={() => handleShare('whatsapp')}
              sx={{
                borderColor: '#25d366',
                color: '#25d366',
                '&:hover': {
                  backgroundColor: '#25d366',
                  color: 'white'
                }
              }}
            >
              WhatsApp
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Instagram />}
              onClick={() => handleShare('instagram')}
              sx={{
                borderColor: '#e4405f',
                color: '#e4405f',
                '&:hover': {
                  backgroundColor: '#e4405f',
                  color: 'white'
                }
              }}
            >
              Instagram
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Other Options */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Other Options
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyToClipboard}
              sx={{ flex: 1, minWidth: '140px' }}
            >
              Copy Link
            </Button>
            
            {navigator.share && (
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleNativeShare}
                sx={{ flex: 1, minWidth: '140px' }}
              >
                More Options
              </Button>
            )}
            
            {shareType === 'photo' && shareData.imageUrl && (
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = shareData.imageUrl;
                  link.download = `sabah-adventure-${Date.now()}.jpg`;
                  link.click();
                }}
                sx={{ flex: 1, minWidth: '140px' }}
              >
                Download
              </Button>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCopySuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Copied to clipboard! You can now paste it anywhere.
        </Alert>
      </Snackbar>
    </>
  );
};

export default SocialSharing;