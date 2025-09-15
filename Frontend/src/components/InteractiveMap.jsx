import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Chip, Button, Card, CardContent } from '@mui/material';
import { LocationOn, CheckCircle, Lock, Star } from '@mui/icons-material';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color, completed = false) => {
  const iconHtml = completed 
    ? `<div style="background-color: #4caf50; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><span style="color: white; font-size: 16px;">✓</span></div>`
    : `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><span style="color: white; font-size: 12px;">📍</span></div>`;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Sample quest locations in Sabah
const questLocations = [
  {
    id: 'kk-city-center',
    name: 'Kota Kinabalu City Center',
    position: [5.9804, 116.0735],
    type: 'cultural',
    difficulty: 'easy',
    points: 50,
    description: 'Explore the heart of Sabah\'s capital city',
    quests: ['Take a photo at the iconic Clock Tower', 'Find the local handicraft market'],
    completed: false,
    unlocked: true
  },
  {
    id: 'signal-hill',
    name: 'Signal Hill Observatory',
    position: [5.9847, 116.0736],
    type: 'scenic',
    difficulty: 'medium',
    points: 75,
    description: 'Panoramic views of Kota Kinabalu',
    quests: ['Capture the sunset view', 'Answer trivia about the observatory'],
    completed: false,
    unlocked: true
  },
  {
    id: 'tunku-abdul-rahman',
    name: 'Tunku Abdul Rahman Marine Park',
    position: [6.0167, 116.0167],
    type: 'nature',
    difficulty: 'hard',
    points: 100,
    description: 'Beautiful marine park with crystal clear waters',
    quests: ['Spot marine life', 'Complete underwater photography challenge'],
    completed: false,
    unlocked: false
  },
  {
    id: 'sabah-museum',
    name: 'Sabah State Museum',
    position: [5.9667, 116.0667],
    type: 'cultural',
    difficulty: 'medium',
    points: 80,
    description: 'Learn about Sabah\'s rich cultural heritage',
    quests: ['Museum trivia challenge', 'Find traditional artifacts'],
    completed: true,
    unlocked: true
  },
  {
    id: 'gaya-street',
    name: 'Gaya Street Sunday Market',
    position: [5.9833, 116.0667],
    type: 'food',
    difficulty: 'easy',
    points: 60,
    description: 'Experience local food and culture',
    quests: ['Try local delicacies', 'Interview a local vendor'],
    completed: false,
    unlocked: true
  },
  {
    id: 'mount-kinabalu',
    name: 'Mount Kinabalu National Park',
    position: [6.0833, 116.5583],
    type: 'adventure',
    difficulty: 'expert',
    points: 200,
    description: 'Malaysia\'s highest peak and UNESCO World Heritage site',
    quests: ['Reach the summit viewpoint', 'Identify endemic flora'],
    completed: false,
    unlocked: false
  }
];

const getMarkerColor = (type, difficulty) => {
  const colors = {
    cultural: '#f5362e',
    scenic: '#77cbfe',
    nature: '#4caf50',
    food: '#ff9800',
    adventure: '#9c27b0'
  };
  return colors[type] || '#072b80';
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#4caf50',
    medium: '#ff9800',
    hard: '#f44336',
    expert: '#9c27b0'
  };
  return colors[difficulty] || '#757575';
};

const InteractiveMap = ({ quests = [], completedQuests = [], onQuestSelect, userProgress = {} }) => {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [mapCenter, setMapCenter] = useState([5.9804, 116.0735]); // Kota Kinabalu center

  // Add location coordinates to actual quest data
  const questsWithLocations = quests.map(quest => {
    const locationMap = {
      'kk-001': [5.9833, 116.0667], // Gaya Street
      'kk-002': [5.9667, 116.0500], // Tanjung Aru Beach
      'kk-003': [5.9804, 116.0735], // Filipino Market
      'kk-004': [5.9804, 116.0735], // KK City Center
      'kk-005': [5.9847, 116.0736], // Signal Hill
      'sandakan-001': [5.8402, 117.9597], // Sandakan
      'sandakan-002': [5.8402, 117.9597], // Sandakan
      'sandakan-003': [5.8402, 117.9597], // Sandakan
      'tawau-001': [4.2549, 117.8794], // Tawau
      'tawau-002': [4.2549, 117.8794], // Tawau
      'lahad-datu-001': [5.0267, 118.3267], // Lahad Datu
      'lahad-datu-002': [5.0267, 118.3267], // Lahad Datu
      'kudat-001': [6.8833, 116.8333], // Kudat
      'kudat-002': [6.8833, 116.8333], // Kudat
      'ranau-001': [5.9667, 116.6833], // Ranau
      'ranau-002': [5.9667, 116.6833], // Ranau
    };

    return {
      ...quest,
      name: quest.title, // Map title to name for popup
      position: locationMap[quest.id] || [5.9804, 116.0735],
      completed: completedQuests.includes(quest.id),
      unlocked: true, // For now, all quests are unlocked
      difficulty: 'easy', // Default difficulty
      points: 50, // Default points
      quests: [quest.description] // Use description as quest item
    };
  });

  const handleMarkerClick = (quest) => {
    setSelectedQuest(quest);
    if (onQuestSelect) {
      onQuestSelect(quest);
    }
  };

  const handleStartQuest = (quest) => {
    if (quest.unlocked) {
      // Navigate to quest or trigger quest start
      console.log('Starting quest:', quest.id);
      if (onQuestSelect) {
        onQuestSelect(quest);
      }
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={11}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {questsWithLocations.map((quest) => {
          const isCompleted = userProgress[quest.id]?.completed || quest.completed;
          const isUnlocked = userProgress[quest.id]?.unlocked !== false && quest.unlocked;
          
          return (
            <Marker
              key={quest.id}
              position={quest.position}
              icon={createCustomIcon(
                getMarkerColor(quest.type, quest.difficulty),
                isCompleted
              )}
              eventHandlers={{
                click: () => handleMarkerClick(quest),
              }}
            >
              <Popup>
                <Card sx={{ minWidth: 250, maxWidth: 300 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {quest.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={quest.type}
                        size="small"
                        sx={{ 
                          backgroundColor: getMarkerColor(quest.type),
                          color: 'white',
                          textTransform: 'capitalize'
                        }}
                      />
                      <Chip
                        label={quest.difficulty}
                        size="small"
                        sx={{ 
                          backgroundColor: getDifficultyColor(quest.difficulty),
                          color: 'white',
                          textTransform: 'capitalize'
                        }}
                      />
                      <Chip
                        icon={<Star />}
                        label={`${quest.points} pts`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {quest.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Quests:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0, mb: 2 }}>
                      {quest.quests.map((questItem, index) => (
                        <Typography 
                          key={index} 
                          component="li" 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          {questItem}
                        </Typography>
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isCompleted ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Completed"
                          color="success"
                          size="small"
                        />
                      ) : isUnlocked ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleStartQuest(quest)}
                          sx={{
                            background: 'linear-gradient(45deg, #072b80 30%, #0484d6 90%)',
                            color: 'white'
                          }}
                        >
                          Start Quest
                        </Button>
                      ) : (
                        <Chip
                          icon={<Lock />}
                          label="Locked"
                          color="default"
                          size="small"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Legend */}
      <Card 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1000,
          minWidth: 200,
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" gutterBottom>
            Quest Types
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {[
              { type: 'cultural', label: 'Cultural' },
              { type: 'scenic', label: 'Scenic' },
              { type: 'nature', label: 'Nature' },
              { type: 'food', label: 'Food' },
              { type: 'adventure', label: 'Adventure' }
            ].map(({ type, label }) => (
              <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: getMarkerColor(type)
                  }}
                />
                <Typography variant="caption">{label}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InteractiveMap;