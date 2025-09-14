import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Explore as ExploreIcon,
  AutoAwesome as AutoAwesomeIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Weather from '../Weather';

const Header = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/adventure') return 0;
    if (path === '/aiplanner') return 1;
    if (path === '/map') return 2;
    if (path === '/navigation') return 3;
    return false;
  };

  const handleTabChange = (event, newValue) => {
    const paths = ['/adventure', '/aiplanner', '/map', '/navigation'];
    navigate(paths[newValue]);
  };

  const navigationTabs = [
    { 
      label: 'Adventure', 
      value: 'adventure', 
      path: '/adventure', 
      icon: <ExploreIcon />,
      description: 'Discover experiences'
    },
    { 
      label: 'AI Planner', 
      value: 'aiplanner', 
      path: '/aiplanner', 
      icon: <AutoAwesomeIcon />,
      description: 'Smart trip planning',
      highlight: true 
    },
    { 
      label: 'Map', 
      value: 'map', 
      path: '/map', 
      icon: <MapIcon />,
      description: 'Explore locations'
    }
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
        zIndex: theme.zIndex.drawer + 1,
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: 0.8
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1
          }
        }
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', px: { xs: 2, md: 4 }, position: 'relative' }}>
        {/* Logo Section - Positioned absolutely on the left */}
        <Box 
          sx={{ 
            position: 'absolute',
            left: { xs: 16, md: 32 },
            top: '60%',
            transform: 'translateY(-50%)',
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          <img 
             src="./src/assets/images/jumbahlogov2-removebg-preview.png" 
             alt="Jumbah Logo" 
             style={{ 
               height: '150px', 
               width: 'auto'
             }} 
           />
        </Box>

        {/* Navigation Tabs - Centered */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '30px',
            padding: '4px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Tabs
              value={getActiveTab()}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'none'
                },
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  minHeight: '48px',
                  borderRadius: '24px',
                  margin: '2px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }
              }}
            >
              {navigationTabs.map((tab, index) => (
                <Tab
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  iconPosition="start"
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    ...(tab.highlight && {
                      background: 'linear-gradient(45deg, #f5362e, #77cbfe, #0484d6, #072b80)',
                      borderRadius: '20px',
                      margin: '2px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #f5362e, #77cbfe, #0484d6, #072b80)',
                        opacity: 0.9
                      }
                    })
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}

        {/* Weather Widget and Sidebar Toggle - Positioned absolutely on the right */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 16, md: 32 },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Weather />
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;