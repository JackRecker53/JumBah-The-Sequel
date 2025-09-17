import React, { useState } from "react";
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
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Explore as ExploreIcon,
  AutoAwesome as AutoAwesomeIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Weather from "../Weather";
import "./Styling/header.css";

const Header = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/adventure") return 0;
    if (path === "/aiplanner") return 1;
    if (path === "/map") return 2;
    if (path === "/navigation") return 3;
    return false;
  };

  const handleTabChange = (event, newValue) => {
    const paths = ["/adventure", "/aiplanner", "/map", "/navigation"];
    navigate(paths[newValue]);
  };

  const navigationTabs = [
    {
      label: "Adventure",
      value: "adventure",
      path: "/adventure",
      icon: <ExploreIcon />,
      description: "Discover experiences",
    },
    {
      label: (
        <span>
          <span style={{ color: '#2D2C32' }}>Madu</span>
          <span style={{ color: '#F1A33E' }}>AI</span>
        </span>
      ),
      value: "aiplanner",
      path: "/aiplanner",
      icon: <AutoAwesomeIcon />,
      description: "Smart trip planning",
      highlight: true,
    },
    {
      label: "Map",
      value: "map",
      path: "/map",
      icon: <MapIcon />,
      description: "Explore locations",
    },
  ];

  return (
    <AppBar
      position="fixed"
      className="header-appbar"
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: '#ffffff !important',
        backgroundColor: '#ffffff !important'
      }}
    >
      <Toolbar className="header-toolbar">
        {/* Logo Section - Positioned absolutely on the left */}
        <Box className="header-logo-container" onClick={() => navigate("/")}>
          <img
            src="./src/assets/images/jumbahlogo-with-borders.png"
            alt="Jumbah Logo"
            className="header-logo"
          />
        </Box>

        {/* Navigation Tabs - Centered */}
        {!isMobile && (
          <Box className="header-nav-container">
            <Tabs
              value={getActiveTab()}
              onChange={handleTabChange}
              className="header-tabs"
            >
              {navigationTabs.map((tab, index) => (
                <Tab
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  iconPosition="start"
                  className={tab.highlight ? "header-tab-highlight" : ""}
                />
              ))}
            </Tabs>
          </Box>
        )}

        {/* Weather Widget and Sidebar Toggle - Positioned absolutely on the right */}
        <Box className="header-right-section">
          <Weather />
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            onClick={onSidebarToggle}
            className="header-menu-button"
          >
            <MenuIcon className="header-menu-icon" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
