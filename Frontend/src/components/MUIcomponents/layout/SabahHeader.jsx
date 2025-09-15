import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Landscape } from '@mui/icons-material';

const SabahHeader = () => {
  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(135deg, #072b80 0%, #0484d6 100%)',
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
      }}
    >
      <Toolbar>
        <Landscape sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Sabah Explorer
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Land Below the Wind
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SabahHeader;