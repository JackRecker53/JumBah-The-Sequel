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
  Restaurant,
  Hotel,
  LocalActivity,
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
    { text: 'Restaurants', icon: <Restaurant />, path: '/restaurants' },
    { text: 'Hotels', icon: <Hotel />, path: '/hotels' },
    { text: 'Activities', icon: <LocalActivity />, path: '/activities' },
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
    >
      <Box className="sidebar-header">
        <Typography variant="h6" className="sidebar-title">
          Jumbah
        </Typography>
        <IconButton onClick={onClose} className="sidebar-close-button">
          <Close />
        </IconButton>
      </Box>
      
      <Divider className="sidebar-divider" />
      
      <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              className="sidebar-menu-item"
            >
              <ListItemIcon className="sidebar-menu-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                className="sidebar-menu-text"
              />
            </ListItem>
          ))}
        </List>
      
      <Divider className="sidebar-divider-bottom" />
      
      <List>
        {secondaryItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            className="sidebar-menu-item"
          >
            <ListItemIcon className="sidebar-menu-icon">
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              className="sidebar-menu-text"
            />
          </ListItem>
        ))}
      </List>
      
      <Box className="sidebar-bottom">
        <Typography variant="body2" className="sidebar-bottom-text">
          Discover Sabah with Jumbah
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;