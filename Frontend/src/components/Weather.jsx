import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Popover,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  Cloud as CloudIcon,
  Grain as RainIcon,
  AcUnit as SnowIcon,
  Visibility as VisibilityIcon,
  Air as WindIcon,
  Compress as PressureIcon,
  Opacity as HumidityIcon,
  WbTwilight as UVIcon
} from '@mui/icons-material';

const Weather = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const open = Boolean(anchorEl);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return <SunnyIcon sx={{ color: '#FFA726' }} />;
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return <CloudIcon sx={{ color: '#78909C' }} />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <RainIcon sx={{ color: '#42A5F5' }} />;
    } else if (conditionLower.includes('snow')) {
      return <SnowIcon sx={{ color: '#E3F2FD' }} />;
    } else {
      return <CloudIcon sx={{ color: '#78909C' }} />;
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/weather?lat=${latitude}&lon=${longitude}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Using default location (Kota Kinabalu).');
        // Default to Kota Kinabalu, Sabah
        fetchWeatherData(5.9804, 116.0735);
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatWindDirection = (direction) => {
    const directions = {
      'N': 'North', 'NNE': 'North-Northeast', 'NE': 'Northeast', 'ENE': 'East-Northeast',
      'E': 'East', 'ESE': 'East-Southeast', 'SE': 'Southeast', 'SSE': 'South-Southeast',
      'S': 'South', 'SSW': 'South-Southwest', 'SW': 'Southwest', 'WSW': 'West-Southwest',
      'W': 'West', 'WNW': 'West-Northwest', 'NW': 'Northwest', 'NNW': 'North-Northwest'
    };
    return directions[direction] || direction;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          minWidth: 60,
          height: 40,
          mr: 1,
          '&:hover': {
            bgcolor: 'grey.50'
          }
        }}
      >
        {loading ? (
          <CircularProgress size={16} />
        ) : weatherData ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getWeatherIcon(weatherData.current.condition.text)}
            <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
              {Math.round(weatherData.current.temp_c)}°C
            </Typography>
          </Box>
        ) : (
          <CloudIcon sx={{ color: 'text.secondary' }} />
        )}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'white',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 3,
            mt: 1
          }
        }}
      >
        <Paper sx={{ p: 3, minWidth: 320, bgcolor: 'white' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {locationError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {locationError}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : weatherData ? (
            <>
              {/* Location Header */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {weatherData.location.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {weatherData.location.region}, {weatherData.location.country}
                </Typography>
              </Box>

              {/* Current Weather */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ mr: 2 }}>
                  {getWeatherIcon(weatherData.current.condition.text)}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {Math.round(weatherData.current.temp_c)}°C
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Feels like {Math.round(weatherData.current.feelslike_c)}°C
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    {weatherData.current.condition.text}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Weather Details */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HumidityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Humidity
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {weatherData.current.humidity}%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WindIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Wind
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {weatherData.current.wind_kph} km/h
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatWindDirection(weatherData.current.wind_dir)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PressureIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Pressure
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {weatherData.current.pressure_mb} mb
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Visibility
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {weatherData.current.vis_km} km
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <UVIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      UV Index
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {weatherData.current.uv}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Chip
                  label="Powered by WeatherAPI"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
              Unable to load weather data
            </Typography>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default Weather;