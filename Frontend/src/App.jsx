import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './Pages/Home';
import AIPlanner from './Pages/AIPlanner';
import Map from './Pages/map';
import Game from './Pages/game';
import './App.css';

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adventure" element={<Game />} />
          <Route path="/aiplanner" element={<AIPlanner />} />
          <Route path="/map" element={<Map />} />
          {/* Add more routes as needed */}
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
