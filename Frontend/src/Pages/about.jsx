import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Explore,
  EmojiEvents,
  School,
  ConnectWithoutContact,
  LocationOn,
  SportsEsports,
  Star,
  Flight
} from '@mui/icons-material';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';
import Footer from '../components/pagecomponents/footer';
import './Styling/about.css';

const About = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const features = [
    {
      icon: <Explore sx={{ fontSize: 40 }} />,
      title: "Interactive Exploration",
      description: "Discover Sabah's hidden gems through an engaging, interactive journey that makes every destination an adventure."
    },
    {
      icon: <SportsEsports sx={{ fontSize: 40 }} />,
      title: "Gamified Experience",
      description: "Complete challenges, unlock achievements, and turn your travel into an exciting game with rewards and surprises."
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: "Earn Rewards",
      description: "Collect points, badges, and exclusive rewards as you explore different attractions and complete cultural challenges."
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: "Cultural Learning",
      description: "Immerse yourself in Sabah's rich traditions, history, and culture through interactive educational experiences."
    },
    {
      icon: <ConnectWithoutContact sx={{ fontSize: 40 }} />,
      title: "Community Connection",
      description: "Connect with fellow travelers, share experiences, and build lasting memories with the JumBah community."
    },
    {
      icon: <Flight sx={{ fontSize: 40 }} />,
      title: "Departure Gate Rewards",
      description: "Redeem your earned points and rewards at the Departure Gate for exclusive prizes and memorable souvenirs."
    }
  ];

  return (
    <Box className="about-container">
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Hero Section */}
      <Box className={`hero-section ${isMobile ? 'hero-section-mobile' : 'hero-section-desktop'}`}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    className={`hero-title ${isMobile ? 'hero-title-mobile' : 'hero-title-desktop'}`}
                  >
                    About JumBah
                  </Typography>
                  <Typography
                    variant="h5"
                    className={`hero-subtitle ${isMobile ? 'hero-subtitle-mobile' : 'hero-subtitle-desktop'}`}
                  >
                    Your Adventure Companion in Sabah
                  </Typography>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box className="hero-image-container">
                  {/* Logo removed as requested */}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
        
        {/* Decorative elements */}
        <Box className="decorative-icon">
          <LocationOn sx={{ fontSize: 'inherit' }} />
        </Box>
      </Box>

      {/* Mission Statement */}
      <Container maxWidth="lg" className="mission-container">
        <Fade in timeout={2000}>
          <Box className="mission-content">
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              className={`mission-title ${isMobile ? 'mission-title-mobile' : 'mission-title-desktop'}`}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              className={`mission-text ${isMobile ? 'mission-text-mobile' : 'mission-text-desktop'}`}
              sx={{ textAlign: 'center', display: 'block', width: '100%' }}
            >
              "At JumBah, we turn exploring Sabah into an adventure. Discover 
              attractions, culture, and events through an interactive, gamified 
              journey where you can complete challenges, earn rewards, and 
              redeem prizes at the Departure Gate. Our mission is to make 
              Sabah's beauty and traditions more accessible while creating fun, 
              meaningful, and unforgettable travel experiences. With JumBah, 
              exploring isn't just travel — it's about playing, learning, and 
              connecting with Sabah like never before."
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            className={`features-title ${isMobile ? 'features-title-mobile' : 'features-title-desktop'}`}
          >
            What Makes JumBah Special
          </Typography>
          
          <Grid container spacing={4} className="features-grid">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card className="feature-card">
                    <CardContent className="feature-card-content">
                      <Box className="feature-icon">
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        className="feature-title"
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        className="feature-description"
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box className="cta-section">
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            className={`cta-title ${isMobile ? 'cta-title-mobile' : 'cta-title-desktop'}`}
          >
            Ready to Explore Sabah?
          </Typography>
          <Typography
            variant="h6"
            className={`cta-subtitle ${isMobile ? 'cta-subtitle-mobile' : 'cta-subtitle-desktop'}`}
          >
            Join thousands of adventurers who have discovered the magic of Sabah through JumBah
          </Typography>
          <Box className="cta-buttons">
            <Button
              variant="contained"
              size="large"
              startIcon={<Explore />}
              onClick={() => window.location.href = '/'}
              className="cta-button"
            >
              Start Exploring
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default About;