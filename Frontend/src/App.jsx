import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import Home from './Pages/Home';
import AIPlanner from './Pages/AIPlanner';
import Map from './Pages/map';
import Game from './Pages/game';
import About from './Pages/about';
import PageTransition from './components/PageTransition';
// import './App.css'; // Temporarily disabled due to loading issues

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/adventure" element={
          <PageTransition>
            <Game />
          </PageTransition>
        } />
        <Route path="/aiplanner" element={
          <PageTransition>
            <AIPlanner />
          </PageTransition>
        } />
        <Route path="/map" element={
          <PageTransition>
            <Map />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <About />
          </PageTransition>
        } />
        {/* Add more routes as needed */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        <AnimatedRoutes />
      </Box>
    </Router>
  );
}

export default App;
