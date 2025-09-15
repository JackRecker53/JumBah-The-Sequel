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
import './Styling/footer.css';

const Footer = () => {
  return (
    <Box className="footer-container">
      <Box className="footer-content">
        <Grid container spacing={4}>
          {/* About Jumbah */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-section-heading">
              About Jumbah
            </Typography>
            <Typography variant="body2" className="footer-about-text">
              Jumbah is your ultimate guide to discovering the beauty and culture of Sabah. 
              From majestic Mount Kinabalu to pristine diving spots, we help you explore 
              the Land Below the Wind.
            </Typography>
            <Typography variant="body2" className="footer-about-text-secondary">
              Experience authentic Sabahan adventures with our AI-powered planning tools 
              and local expertise.
            </Typography>
          </Grid>

          {/* Practical Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-section-heading">
              Practical Information
            </Typography>
            <Box className="footer-contact-item">
              <Phone className="footer-contact-icon" />
              <Typography variant="body2">+60 88-123-4567</Typography>
            </Box>
            <Box className="footer-contact-item">
              <Email className="footer-contact-icon" />
              <Typography variant="body2">info@jumbah.com</Typography>
            </Box>
            <Box className="footer-contact-item-last">
              <LocationOn className="footer-contact-icon" />
              <Typography variant="body2">Kota Kinabalu, Sabah, Malaysia</Typography>
            </Box>
            <Typography variant="body2" className="footer-emergency-text">
              Emergency: 999 | Tourism Hotline: 1-300-88-5050
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-section-heading">
              Follow Us
            </Typography>
            <Typography variant="body2" className="footer-social-text">
              Stay connected for the latest updates on Sabah's hidden gems and travel tips.
            </Typography>
            <Box className="footer-social-buttons">
              <IconButton className="footer-social-button">
                <Facebook />
              </IconButton>
              <IconButton className="footer-social-button">
                <Instagram />
              </IconButton>
              <IconButton className="footer-social-button">
                <Twitter />
              </IconButton>
              <IconButton className="footer-social-button">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        {/* Divider */}
        <Divider className="footer-divider" />
        
        {/* Copyright */}
        <Typography variant="body2" className="footer-copyright">
          © 2024 Jumbah. All rights reserved. | Discover Sabah with confidence.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;