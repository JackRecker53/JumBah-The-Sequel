import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';

const Map = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 4 }}>
          Interactive Map
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Coming Soon - Explore Sabah with our interactive map
        </Typography>
      </Container>
    </Box>
  );
};

export default Map;