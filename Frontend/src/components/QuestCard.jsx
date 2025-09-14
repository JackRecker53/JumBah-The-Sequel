import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(1),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const QuestCard = ({ quest, onStartQuest, isCompleted = false }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'qr': return '📱';
      case 'photo': return '📸';
      case 'trivia': return '🧠';
      case 'audio': return '🎤';
      default: return '🎯';
    }
  };

  const getRewardIcon = (reward) => {
    return reward?.type === 'badge' ? '🎖️' : '🗺️';
  };

  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={quest.image}
        alt={quest.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {quest.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {quest.description}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label={quest.district.toUpperCase()} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`${getTypeIcon(quest.type)} ${quest.type.toUpperCase()}`} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
          <Chip 
            label={`${getRewardIcon(quest.reward)} ${quest.reward?.name}`} 
            size="small" 
            color="success" 
            variant="outlined"
          />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant={isCompleted ? "outlined" : "contained"}
            color={isCompleted ? "success" : "primary"}
            onClick={() => onStartQuest(quest)}
            disabled={isCompleted}
            fullWidth
          >
            {isCompleted ? '✅ Completed' : 'Start Quest'}
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default QuestCard;