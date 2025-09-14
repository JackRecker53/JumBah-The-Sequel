import React from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1e3a8a',
        color: 'white',
        py: 6
      }}
    >
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* About Jumbah */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              About Jumbah
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Jumbah is your ultimate guide to discovering the beauty and culture of Sabah. 
              From majestic Mount Kinabalu to pristine diving spots, we help you explore 
              the Land Below the Wind.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Experience authentic Sabahan adventures with our AI-powered planning tools 
              and local expertise.
            </Typography>
          </Grid>

          {/* Practical Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Practical Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">+60 88-123-4567</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">info@jumbah.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">Kota Kinabalu, Sabah, Malaysia</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              Emergency: 999 | Tourism Hotline: 1-300-88-5050
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: '#3b5998' }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: '#E4405F' }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: '#1DA1F2' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: '#FF0000' }
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              Stay updated with the latest Sabahan adventures and travel tips!
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 Jumbah. All rights reserved. | Made with ❤️ for Sabah
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;