import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  Home,
  Explore,
  Map,
  Info,
  Close
} from '@mui/icons-material';
import './Styling/sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Adventure', icon: <Explore />, path: '/adventure' },
    { text: 'Map', icon: <Map />, path: '/map' },
  ];

  const secondaryItems = [
    { text: 'About Jumbah', icon: <Info />, path: '/about' },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="sidebar-drawer"
      sx={{
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(135deg, #072b80 0%, #0484d6 100%)',
        }
      }}
    >
      <Box className="sidebar-header">
        <Box className="sidebar-brand">
          <img 
            src="./src/assets/images/jumbahlogov2-removebg-preview.png" 
            alt="Jumbah Logo" 
            className="sidebar-logo"
          />
          <Typography variant="h6" className="sidebar-title">
            Jumbah™
          </Typography>
        </Box>
        <IconButton onClick={onClose} className="sidebar-close-button">
          <Close />
        </IconButton>
      </Box>
      
      <Divider className="sidebar-divider" />
      

      
      <List className="sidebar-menu-list">
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            className="sidebar-menu-item"
            disablePadding
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              className="sidebar-menu-button"
            >
              <ListItemIcon className="sidebar-menu-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                className="sidebar-menu-text"
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider className="sidebar-divider-bottom" />
      
      <List className="sidebar-secondary-list">
        {secondaryItems.map((item) => (
          <ListItem
            key={item.text}
            className="sidebar-menu-item"
            disablePadding
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              className="sidebar-menu-button"
            >
              <ListItemIcon className="sidebar-menu-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                className="sidebar-menu-text"
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box className="sidebar-bottom">
          <Typography variant="body2" className="sidebar-bottom-text">
            Jumbah
          </Typography>
          <Typography variant="caption" className="sidebar-bottom-subtitle">
            Your Adventure Companion
          </Typography>
        </Box>
    </Drawer>
  );
};

export default Sidebar;