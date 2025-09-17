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
import jumbahLogo from '../assets/images/jumbah-logo-orangutan.svg';

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
    <Box sx={{ minHeight: '100vh' }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #072b80 0%, #0484d6 50%, #7cb342 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      color: 'white'
                    }}
                  >
                    About JumBah
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      opacity: 0.9,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                  >
                    Your Adventure Companion in Sabah
                  </Typography>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src="./src/assets/images/WhatsApp Image 2025-09-04 at 14.30.49_b8a2ae6d.jpg"
                    alt="Location Pin Background"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                      borderRadius: '12px'
                    }}
                  />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            opacity: 0.1,
            fontSize: '200px',
            transform: 'rotate(15deg)'
          }}
        >
          <LocationOn sx={{ fontSize: 'inherit' }} />
        </Box>
      </Box>

      {/* Mission Statement */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in timeout={2000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#2d5016',
                mb: 4,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
                color: '#555',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontStyle: 'italic'
              }}
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
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#2d5016',
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            What Makes JumBah Special
          </Typography>
          
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      },
                      borderRadius: 3,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box
                        sx={{
                          color: '#072b80',
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          color: '#2d5016',
                          mb: 2
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#666',
                          lineHeight: 1.6
                        }}
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
      <Box
        sx={{
          background: '#0085D7',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Ready to Explore Sabah?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Join thousands of adventurers who have discovered the magic of Sabah through JumBah
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Explore />}
              onClick={() => window.location.href = '/'}
              sx={{
                background: 'linear-gradient(135deg, #072b80 0%, #0484d6 50%, #7cb342 100%)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #051f5c 0%, #0369a8 50%, #5a8f2f 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(7,43,128,0.4)'
                },
                transition: 'all 0.3s ease'
              }}
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