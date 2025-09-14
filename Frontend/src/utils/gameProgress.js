// Game Progress Tracking Utility

const STORAGE_KEY = 'jumbah_game_progress';

// Initialize or get existing progress
export const getGameProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading game progress:', error);
  }
  
  // Default progress structure
  return {
    completedQuests: [],
    totalScore: 0,
    stamps: [],
    lastUpdated: new Date().toISOString()
  };
};

// Save progress to localStorage
export const saveGameProgress = (progress) => {
  try {
    const updatedProgress = {
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    return updatedProgress;
  } catch (error) {
    console.error('Error saving game progress:', error);
    return progress;
  }
};

// Mark a quest as completed
export const completeQuest = (questId, questData) => {
  const progress = getGameProgress();
  
  // Check if quest is already completed
  if (progress.completedQuests.includes(questId)) {
    return progress;
  }
  
  // Add quest to completed list
  progress.completedQuests.push(questId);
  
  // Add score (10 points per quest)
  progress.totalScore += 10;
  
  // Add stamp if quest has a reward
  if (questData.reward) {
    progress.stamps.push({
      questId,
      stampName: questData.reward.name,
      stampType: questData.reward.type,
      earnedAt: new Date().toISOString()
    });
  }
  
  return saveGameProgress(progress);
};

// Check if a quest is completed
export const isQuestCompleted = (questId) => {
  const progress = getGameProgress();
  return progress.completedQuests.includes(questId);
};

// Get completion percentage
export const getCompletionPercentage = (totalQuests) => {
  const progress = getGameProgress();
  if (totalQuests === 0) return 0;
  return Math.round((progress.completedQuests.length / totalQuests) * 100);
};

// Get completed quests count
export const getCompletedQuestsCount = () => {
  const progress = getGameProgress();
  return progress.completedQuests.length;
};

// Reset all progress (for testing or new game)
export const resetGameProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return getGameProgress(); // Returns default structure
  } catch (error) {
    console.error('Error resetting game progress:', error);
    return getGameProgress();
  }
};

// Get all stamps earned
export const getEarnedStamps = () => {
  const progress = getGameProgress();
  return progress.stamps || [];
};

// Mock submission handler for different quest types
export const submitQuestMock = async (questId, questType, submissionData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation logic
  let isValid = false;
  let message = '';
  
  switch (questType) {
    case 'qr':
      isValid = submissionData.qrCode === submissionData.expectedSecret;
      message = isValid ? 'QR code scanned successfully!' : 'Invalid QR code. Please try again.';
      break;
      
    case 'photo':
      isValid = submissionData.photo !== null;
      message = isValid ? 'Photo uploaded successfully!' : 'Please upload a photo to complete this quest.';
      break;
      
    case 'trivia':
      isValid = submissionData.answers && submissionData.answers.length > 0;
      message = isValid ? 'Trivia completed successfully!' : 'Please answer the trivia questions.';
      break;
      
    case 'audio':
      isValid = submissionData.audioBlob !== null;
      message = isValid ? 'Audio recorded successfully!' : 'Please record audio to complete this quest.';
      break;
      
    default:
      isValid = true;
      message = 'Quest completed!';
  }
  
  return {
    success: isValid,
    message,
    questId,
    submittedAt: new Date().toISOString()
  };
};