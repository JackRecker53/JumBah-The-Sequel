import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const navigationTabs = [
    { label: 'Adventure', value: 'adventure', path: '/adventure' },
    { label: 'AI Planner', value: 'aiplanner', path: '/aiplanner', highlight: true },
    { label: 'Map', value: 'map', path: '/map' }
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
            height: '64px'
          }}
          onClick={() => handleTabClick('home', '/')}
        >
          <img 
             src="./src/assets/images/jumbahlogov2-removebg-preview.png" 
             alt="Jumbah Logo" 
             style={{ 
               height: '64px', 
               width: 'auto'
             }} 
           />
        </Box>

        {/* Navigation Tabs - Center */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navigationTabs.map((tab) => (
              <Button
                key={tab.value}
                onClick={() => handleTabClick(tab.value, tab.path)}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(tab.highlight ? {
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                    backgroundSize: '300% 300%',
                    animation: 'gradientShift 3s ease infinite',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5252, #26a69a, #42a5f5, #81c784)',
                      backgroundSize: '300% 300%',
                    },
                    '@keyframes gradientShift': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' }
                    }
                  } : {
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(activeTab === tab.value && {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    })
                  })
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Sidebar Toggle Button - Right */}
        <IconButton
          color="inherit"
          aria-label="open sidebar"
          onClick={onSidebarToggle}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <MenuIcon sx={{ fontSize: '1.8rem' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;