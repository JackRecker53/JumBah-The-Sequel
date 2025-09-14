import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
  border: `1px solid ${theme.palette.primary.light}`,
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const GameProgressBar = ({ 
  completedQuests, 
  totalQuests, 
  totalScore, 
  stamps 
}) => {
  const completionPercentage = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'primary';
  };

  const getProgressMessage = (percentage) => {
    if (percentage === 100) return '🎉 Adventure Complete!';
    if (percentage >= 80) return '🌟 Almost there!';
    if (percentage >= 50) return '🚀 Great progress!';
    if (percentage >= 25) return '⭐ Getting started!';
    return '🗺️ Begin your journey!';
  };

  return (
    <ProgressContainer elevation={2}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🎮 Adventure Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getProgressMessage(completionPercentage)}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            Quests Completed
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {completedQuests}/{totalQuests} ({completionPercentage}%)
          </Typography>
        </Box>
        <StyledLinearProgress 
          variant="determinate" 
          value={completionPercentage}
          color={getProgressColor(completionPercentage)}
        />
      </Box>

      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Chip 
          icon={<span>🏆</span>}
          label={`${totalScore} Points`}
          color="primary"
          variant="outlined"
          size="small"
        />
        <Chip 
          icon={<span>🎖️</span>}
          label={`${stamps.length} Stamps`}
          color="secondary"
          variant="outlined"
          size="small"
        />
        <Chip 
          icon={<span>✅</span>}
          label={`${completedQuests} Completed`}
          color="success"
          variant="outlined"
          size="small"
        />
        {totalQuests - completedQuests > 0 && (
          <Chip 
            icon={<span>⏳</span>}
            label={`${totalQuests - completedQuests} Remaining`}
            color="default"
            variant="outlined"
            size="small"
          />
        )}
      </Stack>

      {completionPercentage === 100 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="body2" color="success.dark" textAlign="center">
            🎊 Congratulations! You've completed all quests in Sabah! 🎊
          </Typography>
        </Box>
      )}
    </ProgressContainer>
  );
};

export default GameProgressBar;