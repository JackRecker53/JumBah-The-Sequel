import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';
import QuestCard from '../components/QuestCard';
import QRScanner from '../components/QRScanner';
import GameProgressBar from '../components/GameProgressBar';
import questsData from '../data/quests.json';
import {
  getGameProgress,
  completeQuest,
  isQuestCompleted,
  getCompletionPercentage,
  getCompletedQuestsCount,
  submitQuestMock
} from '../utils/gameProgress';

const Game = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [questDialogOpen, setQuestDialogOpen] = useState(false);
  const [gameProgress, setGameProgress] = useState(getGameProgress());
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  
  // Quest submission states
  const [photoFile, setPhotoFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [triviaAnswers, setTriviaAnswers] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleStartQuest = (quest) => {
    if (isQuestCompleted(quest.id)) {
      return; // Quest already completed
    }
    setSelectedQuest(quest);
    setQuestDialogOpen(true);
    setSubmissionResult(null);
    // Reset submission states
    setPhotoFile(null);
    setAudioBlob(null);
    setTriviaAnswers({});
  };

  const handleCloseQuestDialog = () => {
    setQuestDialogOpen(false);
    setSelectedQuest(null);
    setSubmissionResult(null);
    // Stop any ongoing recording
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleQRSuccess = async (qrCode) => {
    if (!selectedQuest) return;
    
    setSubmissionLoading(true);
    try {
      const result = await submitQuestMock(selectedQuest.id, 'qr', {
        qrCode,
        expectedSecret: selectedQuest.qr_secret
      });
      
      setSubmissionResult(result);
      
      if (result.success) {
        const updatedProgress = completeQuest(selectedQuest.id, selectedQuest);
        setGameProgress(updatedProgress);
      }
    } catch (error) {
      setSubmissionResult({ success: false, message: 'Error submitting quest' });
    }
    setSubmissionLoading(false);
  };

  const handlePhotoSubmit = async () => {
    if (!selectedQuest || !photoFile) return;
    
    setSubmissionLoading(true);
    try {
      const result = await submitQuestMock(selectedQuest.id, 'photo', {
        photo: photoFile
      });
      
      setSubmissionResult(result);
      
      if (result.success) {
        const updatedProgress = completeQuest(selectedQuest.id, selectedQuest);
        setGameProgress(updatedProgress);
      }
    } catch (error) {
      setSubmissionResult({ success: false, message: 'Error submitting photo' });
    }
    setSubmissionLoading(false);
  };

  const handleTriviaSubmit = async () => {
    if (!selectedQuest || Object.keys(triviaAnswers).length === 0) return;
    
    setSubmissionLoading(true);
    try {
      const result = await submitQuestMock(selectedQuest.id, 'trivia', {
        answers: Object.values(triviaAnswers)
      });
      
      setSubmissionResult(result);
      
      if (result.success) {
        const updatedProgress = completeQuest(selectedQuest.id, selectedQuest);
        setGameProgress(updatedProgress);
      }
    } catch (error) {
      setSubmissionResult({ success: false, message: 'Error submitting trivia' });
    }
    setSubmissionLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleAudioSubmit = async () => {
    if (!selectedQuest || !audioBlob) return;
    
    setSubmissionLoading(true);
    try {
      const result = await submitQuestMock(selectedQuest.id, 'audio', {
        audioBlob
      });
      
      setSubmissionResult(result);
      
      if (result.success) {
        const updatedProgress = completeQuest(selectedQuest.id, selectedQuest);
        setGameProgress(updatedProgress);
      }
    } catch (error) {
      setSubmissionResult({ success: false, message: 'Error submitting audio' });
    }
    setSubmissionLoading(false);
  };

  const handleMockSubmit = async () => {
    if (!selectedQuest) return;
    
    setSubmissionLoading(true);
    try {
      const result = await submitQuestMock(selectedQuest.id, selectedQuest.type, {
        mock: true
      });
      
      setSubmissionResult(result);
      
      if (result.success) {
        const updatedProgress = completeQuest(selectedQuest.id, selectedQuest);
        setGameProgress(updatedProgress);
      }
    } catch (error) {
      setSubmissionResult({ success: false, message: 'Error submitting quest' });
    }
    setSubmissionLoading(false);
  };

  // Check for celebration when all quests are completed
  useEffect(() => {
    const completedCount = getCompletedQuestsCount();
    const totalQuests = questsData.length;
    
    if (completedCount === totalQuests && completedCount > 0 && !celebrationOpen) {
      setCelebrationOpen(true);
    }
  }, [gameProgress.completedQuests, questsData.length, celebrationOpen]);

  const renderQuestContent = () => {
    if (!selectedQuest) return null;

    const mockSubmitButton = (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleMockSubmit}
          disabled={submissionLoading}
          size="small"
        >
          {submissionLoading ? <CircularProgress size={16} /> : '🎯 Mock Submit (Testing)'}
        </Button>
      </Box>
    );

    switch (selectedQuest.type) {
      case 'qr':
        return (
          <Box>
            <QRScanner
              onScanSuccess={handleQRSuccess}
              expectedSecret={selectedQuest.qr_secret}
            />
            {mockSubmitButton}
          </Box>
        );
        
      case 'photo':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Upload a photo to complete this quest:
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              style={{ marginBottom: 16 }}
            />
            {photoFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="success.main">
                  ✅ Photo selected: {photoFile.name}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handlePhotoSubmit}
                  disabled={submissionLoading}
                  sx={{ mt: 2 }}
                >
                  {submissionLoading ? <CircularProgress size={20} /> : 'Submit Photo'}
                </Button>
              </Box>
            )}
            {mockSubmitButton}
          </Box>
        );
        
      case 'trivia':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Trivia Questions:</Typography>
            {selectedQuest.trivia?.map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Typography variant="body1" fontWeight="medium">
                      {index + 1}. {item.q}
                    </Typography>
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Your answer..."
                    value={triviaAnswers[index] || ''}
                    onChange={(e) => setTriviaAnswers(prev => ({
                      ...prev,
                      [index]: e.target.value
                    }))}
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Hint: {item.a}
                  </Typography>
                </FormControl>
              </Paper>
            ))}
            <Button
              variant="contained"
              onClick={handleTriviaSubmit}
              disabled={submissionLoading || Object.keys(triviaAnswers).length === 0}
              fullWidth
            >
              {submissionLoading ? <CircularProgress size={20} /> : 'Submit Answers'}
            </Button>
            {mockSubmitButton}
          </Box>
        );
        
      case 'audio':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Record yourself saying a local Sabahan greeting:
            </Typography>
            <Box sx={{ mb: 2 }}>
              {!isRecording ? (
                <Button
                  variant="contained"
                  onClick={startRecording}
                  disabled={!!audioBlob}
                >
                  🎤 Start Recording
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={stopRecording}
                  color="error"
                >
                  ⏹️ Stop Recording
                </Button>
              )}
            </Box>
            {audioBlob && (
              <Box>
                <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                  ✅ Audio recorded successfully!
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleAudioSubmit}
                  disabled={submissionLoading}
                >
                  {submissionLoading ? <CircularProgress size={20} /> : 'Submit Recording'}
                </Button>
              </Box>
            )}
            {mockSubmitButton}
          </Box>
        );
        
      default:
        return (
          <Typography variant="body1">
            Quest type not supported yet.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
          🗺️ Sabah Adventure Quests
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
          Explore Sabah through interactive quests and challenges
        </Typography>

        <GameProgressBar
          completedQuests={getCompletedQuestsCount()}
          totalQuests={questsData.length}
          totalScore={gameProgress.totalScore}
          stamps={gameProgress.stamps}
        />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {questsData.map((quest) => (
            <Grid item xs={12} sm={6} md={4} key={quest.id}>
              <QuestCard
                quest={quest}
                onStartQuest={handleStartQuest}
                isCompleted={isQuestCompleted(quest.id)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Quest Dialog */}
        <Dialog
          open={questDialogOpen}
          onClose={handleCloseQuestDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">
              {selectedQuest?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedQuest?.description}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {submissionResult && (
              <Alert 
                severity={submissionResult.success ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                {submissionResult.message}
              </Alert>
            )}
            {renderQuestContent()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuestDialog}>
              {submissionResult?.success ? 'Close' : 'Cancel'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Celebration Modal */}
        <Dialog
          open={celebrationOpen}
          onClose={() => setCelebrationOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ fontSize: '4rem', mb: 2 }}>🎉</Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
              Congratulations!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
              You've completed all Sabah Adventure Quests!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                  {gameProgress.totalScore}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Total Score
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                  {gameProgress.stamps.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Stamps Collected
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              You are now a true Sabah Explorer! 🏆
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              onClick={() => setCelebrationOpen(false)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                },
                borderRadius: 2,
                px: 4
              }}
            >
              Continue Exploring
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Game;