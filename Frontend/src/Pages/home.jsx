import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Link,
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
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';
import Footer from '../components/pagecomponents/footer';

// Import Splide styles
import '@splidejs/react-splide/css';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Sabah Fest 2024',
      date: 'May 15-20, 2024',
      location: 'Kota Kinabalu',
      image: './src/assets/images/WhatsApp Image 2025-07-02 at 17.29.01_1189cec1.jpg',
      description: 'Annual cultural festival celebrating Sabahan heritage'
    },
    {
      id: 2,
      title: 'Mount Kinabalu Climbing Festival',
      date: 'June 10-12, 2024',
      location: 'Kinabalu Park',
      image: './src/assets/images/MountKinabalu.png',
      description: 'Adventure climbing event for all skill levels'
    },
    {
      id: 3,
      title: 'Borneo Jazz Festival',
      date: 'July 5-7, 2024',
      location: 'Miri',
      image: './src/assets/images/WhatsApp Image 2025-09-02 at 15.19.31_2332b235.jpg',
      description: 'International jazz music festival'
    },
    {
      id: 4,
      title: 'Sipadan Diving Championship',
      date: 'August 20-25, 2024',
      location: 'Sipadan Island',
      image: './src/assets/images/WhatsApp Image 2025-09-04 at 14.30.49_b8a2ae6d.jpg',
      description: 'World-class diving competition'
    }
  ];

  // Sabah explore categories data
  const exploreCategories = [
    { 
      name: 'City adventures', 
      description: 'Urban exploration in Kota Kinabalu',
      image: './src/assets/images/WhatsApp Image 2025-07-02 at 17.29.01_1189cec1.jpg',
      size: 'small',
      gridArea: '1 / 1 / 2 / 2'
    },
    { 
      name: 'Fun activities', 
      description: 'Adventure sports and outdoor fun',
      image: './src/assets/images/WhatsApp Image 2025-09-02 at 15.19.31_2332b235.jpg',
      size: 'small',
      gridArea: '1 / 2 / 2 / 3'
    },
    { 
      name: 'Art and culture', 
      description: 'Museums and cultural heritage sites',
      image: './src/assets/images/WhatsApp Image 2025-09-04 at 14.30.49_b8a2ae6d.jpg',
      size: 'large',
      gridArea: '1 / 3 / 3 / 4'
    },
    { 
      name: 'Live music', 
      description: 'Concerts and music festivals',
      image: './src/assets/images/MountKinabalu.png',
      size: 'wide',
      gridArea: '2 / 1 / 3 / 3'
    },
    { 
      name: 'Nature and wildlife', 
      description: 'Rainforests and wildlife sanctuaries',
      image: './src/assets/images/WhatsApp Image 2025-07-02 at 17.29.01_1189cec1.jpg',
      size: 'small',
      gridArea: '3 / 1 / 4 / 2'
    },
    { 
      name: 'Road trips', 
      description: 'Scenic drives and itineraries',
      image: './src/assets/images/WhatsApp Image 2025-09-02 at 15.19.31_2332b235.jpg',
      size: 'small',
      gridArea: '3 / 2 / 4 / 3'
    },
    { 
      name: 'Destinations', 
      description: 'Must-visit places in Sabah',
      image: './src/assets/images/WhatsApp Image 2025-09-04 at 14.30.49_b8a2ae6d.jpg',
      size: 'small',
      gridArea: '4 / 1 / 5 / 2'
    },
    { 
      name: 'Entertainment', 
      description: 'Nightlife and entertainment venues',
      image: './src/assets/images/MountKinabalu.png',
      size: 'small',
      gridArea: '4 / 2 / 5 / 3'
    },
    { 
      name: 'Eat and drink', 
      description: 'Local cuisine and dining experiences',
      image: './src/assets/images/WhatsApp Image 2025-07-02 at 17.29.01_1189cec1.jpg',
      size: 'small',
      gridArea: '4 / 3 / 5 / 4'
    },
    { 
      name: 'Places to stay', 
      description: 'Hotels and accommodations',
      image: './src/assets/images/WhatsApp Image 2025-09-02 at 15.19.31_2332b235.jpg',
      size: 'small',
      gridArea: '5 / 1 / 6 / 2'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header onSidebarToggle={handleSidebarToggle} />
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hero Section with Mount Kinabalu */}
      <Box
        sx={{
          height: '100vh',
          backgroundImage: 'url(./src/assets/images/MountKinabalu.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              mb: 2
            }}
          >
            Discover Sabah
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              mb: 4,
              opacity: 0.9
            }}
          >
            Land Below the Wind
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              color: 'white',
              px: 4,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '30px',
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5252, #26a69a)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 25px rgba(0,0,0,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Your Adventure
          </Button>
        </Box>
      </Box>

      {/* Events Carousel Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#1e3a8a',
              mb: 6
            }}
          >
            Upcoming Events in Sabah
          </Typography>
          
          <Splide
            options={{
              type: 'loop',
              perPage: 3,
              perMove: 1,
              gap: '2rem',
              padding: { left: '5rem', right: '5rem' },
              autoplay: true,
              interval: 4000,
              pauseOnHover: true,
              arrows: true,
              pagination: true,
              breakpoints: {
                1024: {
                  perPage: 2,
                  padding: { left: '3rem', right: '3rem' },
                },
                768: {
                  perPage: 1,
                  padding: { left: '2rem', right: '2rem' },
                },
                640: {
                  perPage: 1,
                  padding: { left: '1rem', right: '1rem' },
                },
              },
            }}
            style={{ paddingBottom: '50px' }}
          >
            {events.map((event) => (
              <SplideSlide key={event.id}>
                <Box
                  sx={{
                    position: 'relative',
                    height: '350px',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  {/* Background Image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${event.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                        zIndex: 1
                      }
                    }}
                  />
                  
                  {/* Overlapping Text Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      zIndex: 2,
                      color: 'white'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1,
                        color: '#ffd700',
                        fontWeight: 600,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                      }}
                    >
                      {event.date}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                      }}
                    >
                      📍 {event.location}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        opacity: 0.8,
                        lineHeight: 1.4,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                      }}
                    >
                      {event.description}
                    </Typography>
                  </Box>
                </Box>
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      </Box>

      {/* Explore Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'left',
              fontWeight: 700,
              color: '#1e3a8a',
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            EXPLORE
          </Typography>
          
          {/* Masonry Grid Layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(5, 200px)',
              gap: 2,
              '@media (max-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(8, 150px)',
              },
              '@media (max-width: 480px)': {
                gridTemplateColumns: '1fr',
                gridTemplateRows: 'repeat(10, 200px)',
              }
            }}
          >
            {exploreCategories.map((category, index) => (
              <Box
                key={index}
                sx={{
                  gridArea: category.gridArea,
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  '@media (max-width: 768px)': {
                    gridArea: 'auto',
                  }
                }}
              >
                {/* Background Image */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
                      zIndex: 1
                    }
                  }}
                />
                
                {/* Heart Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 3,
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#ff6b6b'
                    }
                  }}
                >
                  <IconButton sx={{ color: 'inherit', p: 0.5 }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>♡</Typography>
                  </IconButton>
                </Box>
                
                {/* Overlapping Text Content */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    zIndex: 2,
                    color: 'white'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.5,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      opacity: 0.9,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {category.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;