import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Chip, 
  Button, 
  TextField, 
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardActions,
  Fab,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  Navigation as NavigationIcon,
  Event as EventIcon,
  Place as PlaceIcon,
  Close as CloseIcon,
  Directions as DirectionsIcon,
  FilterList as FilterIcon,
  DirectionsWalk as WalkIcon,
  DirectionsCar as CarIcon,
  DirectionsBus as BusIcon,
  Flight as FlightIcon,
  LocationOn as LocationIcon,
  Route as RouteIcon,
  AccessTime as TimeIcon,
  Traffic as TrafficIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';
import apiService from '../services/api';
// Leaflet CSS loaded via CDN in index.html

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color, iconType) => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
    ">
      ${iconType}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Sample data for Sabah locations
const sabahLocations = {
  attractions: [
    {
      id: 1,
      name: "Mount Kinabalu",
      position: [6.0755, 116.5581],
      type: "attraction",
      description: "Malaysia's highest peak and UNESCO World Heritage Site",
      category: "Nature",
      rating: 4.8
    },
    {
      id: 2,
      name: "Sipadan Island",
      position: [4.1158, 118.6281],
      type: "attraction",
      description: "World-renowned diving destination",
      category: "Marine",
      rating: 4.9
    },
    {
      id: 3,
      name: "Kinabatangan River",
      position: [5.4167, 118.2333],
      type: "attraction",
      description: "Wildlife sanctuary and river cruise destination",
      category: "Wildlife",
      rating: 4.7
    },
    {
      id: 4,
      name: "Maliau Basin",
      position: [4.7333, 116.9667],
      type: "attraction",
      description: "Lost World of Sabah - pristine rainforest",
      category: "Nature",
      rating: 4.6
    },
    {
      id: 5,
      name: "Tunku Abdul Rahman Marine Park",
      position: [6.0167, 116.0167],
      type: "attraction",
      description: "Island hopping and marine activities",
      category: "Marine",
      rating: 4.5
    }
  ],
  events: [
    {
      id: 6,
      name: "Kaamatan Festival",
      position: [5.9804, 116.0735],
      type: "event",
      description: "Annual harvest festival celebration",
      date: "May 30-31, 2025",
      category: "Cultural"
    },
    {
      id: 7,
      name: "Regatta Lepa",
      position: [4.6167, 118.6167],
      type: "event",
      description: "Traditional boat festival in Semporna",
      date: "April 15-17, 2025",
      category: "Cultural"
    },
    {
      id: 8,
      name: "Borneo Jazz Festival",
      position: [4.4167, 114.0167],
      type: "event",
      description: "International jazz music festival",
      date: "May 10-12, 2025",
      category: "Music"
    }
  ]
};

// Component to handle map events and user location
const MapController = ({ onLocationFound, userLocation, setUserLocation, mapRef }) => {
  const map = useMap();
  
  // Set map reference for parent component
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  
  // Remove the automatic location events to prevent conflicts
  // Only handle manual location requests through the FAB button
  
  const locateUser = () => {
    if (userLocation) {
      // If location is already available, just center the map
      map.setView([userLocation.lat, userLocation.lng], 16);
    }
    // Remove automatic location request - this will be handled by getCurrentLocation
  };
  
  // Add locate control button
  useEffect(() => {
    const locateControl = L.control({ position: 'topright' });
    
    locateControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      div.innerHTML = `<button style="background: ${userLocation ? '#4caf50' : 'white'}; border: none; width: 30px; height: 30px; cursor: pointer;">📍</button>`;
      div.onclick = locateUser;
      return div;
    };
    
    locateControl.addTo(map);
    
    return () => {
      map.removeControl(locateControl);
    };
  }, [map, userLocation]);
  
  return null;
};

const Map = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('car');
  const [routes, setRoutes] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromLocationData, setFromLocationData] = useState(null);
  const [toLocationData, setToLocationData] = useState(null);
  const [nearbyPOIs, setNearbyPOIs] = useState([]);
  const [poisLoading, setPoisLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const mapRef = useRef();
  const searchRef = useRef();
  const fromInputRef = useRef();
  const toInputRef = useRef();
  
  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Don't clear search query, just let the dropdown hide naturally
      }
    };
    
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);
  
  // Navigation data
  const transportModes = [
    { id: 'walk', name: 'Walking', icon: WalkIcon, color: '#4CAF50' },
    { id: 'car', name: 'Driving', icon: CarIcon, color: '#2196F3' },
    { id: 'bus', name: 'Public Transit', icon: BusIcon, color: '#FF9800' }
  ];

  const popularDestinations = [
    { name: 'Kota Kinabalu City Centre', address: 'Kota Kinabalu, Sabah', type: 'City Center', position: [5.9804, 116.0735] },
    { name: 'Jesselton Point', address: 'Kota Kinabalu Waterfront', type: 'Ferry Terminal', position: [5.9788, 116.0753] },
    { name: 'Imago Shopping Mall', address: 'Kota Kinabalu, Sabah', type: 'Shopping Mall', position: [5.9838, 116.0719] },
    { name: 'Suria Sabah', address: 'Kota Kinabalu, Sabah', type: 'Shopping Mall', position: [5.9868689, 116.0773668] },
    { name: 'Centre Point Sabah', address: 'Kota Kinabalu, Sabah', type: 'Shopping Mall', position: [5.9816, 116.0742] },
    { name: 'Warisan Square', address: 'Kota Kinabalu, Sabah', type: 'Shopping Mall', position: [5.9799, 116.0728] },
    { name: 'Sabah State Museum', address: 'Kota Kinabalu, Sabah', type: 'Museum', position: [5.9916, 116.0516] },
    { name: 'Signal Hill Observatory', address: 'Kota Kinabalu, Sabah', type: 'Viewpoint', position: [5.9847, 116.0736] },
    { name: 'Atkinson Clock Tower', address: 'Kota Kinabalu, Sabah', type: 'Historical Site', position: [5.9847, 116.0736] },
    { name: 'Filipino Market', address: 'Kota Kinabalu Waterfront', type: 'Market', position: [5.9788, 116.0753] },
    { name: 'Tanjung Aru Beach', address: 'Tanjung Aru, Kota Kinabalu', type: 'Beach', position: [5.9436, 116.0469] },
    { name: 'Kota Kinabalu International Airport', address: 'Tanjung Aru, Kota Kinabalu', type: 'Airport', position: [5.9372, 116.0515] },
    { name: 'University Malaysia Sabah', address: 'Kota Kinabalu, Sabah', type: 'University', position: [6.0367, 116.1186] },
    { name: 'Queen Elizabeth Hospital', address: 'Kota Kinabalu, Sabah', type: 'Hospital', position: [5.9804, 116.0735] },
    { name: 'Gaya Street Sunday Market', address: 'Gaya Street, Kota Kinabalu', type: 'Market', position: [5.9804, 116.0735] },
    { name: 'Handicraft Market', address: 'Kota Kinabalu Waterfront', type: 'Market', position: [5.9788, 116.0753] },
    { name: 'Likas Bay', address: 'Likas, Kota Kinabalu', type: 'Bay', position: [6.0167, 116.0833] },
    { name: 'Menggatal', address: 'Menggatal, Kota Kinabalu', type: 'Town', position: [6.0167, 116.1167] },
    { name: 'Inanam', address: 'Inanam, Kota Kinabalu', type: 'Town', position: [6.0167, 116.1167] },
    { name: 'Penampang', address: 'Penampang, Sabah', type: 'Town', position: [5.9167, 116.1167] }
  ];
  
  const categories = ['all', 'Nature', 'Marine', 'Wildlife', 'Cultural', 'Music'];
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLocationFound = (latlng) => {
    setLocationError(null);
    console.log('User location found:', latlng);
    // Fetch nearby POIs when location is found
    fetchNearbyPOIs(latlng.lat, latlng.lng);
  };

  // Fetch nearby POIs from backend
  const fetchNearbyPOIs = async (lat, lon, radius = 2000) => {
    setPoisLoading(true);
    try {
      const response = await apiService.getNearbyPOIs(
        lat, 
        lon, 
        radius, 
        ['restaurant', 'tourist', 'shop', 'amenity', 'hotel']
      );
      
      if (response.success) {
        setNearbyPOIs(response.data);
      }
    } catch (error) {
      console.error('Error fetching nearby POIs:', error);
      setLocationError('Failed to load nearby locations');
    } finally {
      setPoisLoading(false);
    }
  };

  // Search locations using backend API
  const searchLocations = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await apiService.searchLocations(query, 20);
      
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocationError('Failed to search locations');
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  const handleCategoryToggle = (category) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== 'all'), category];
      
      setSelectedCategories(newCategories.length === 0 ? ['all'] : newCategories);
    }
  };
  
  const filteredLocations = () => {
    // Combine search results, nearby POIs, and static data
    const allLocations = [
      ...searchResults.map(result => ({
        id: `search_${result.place_id || result.osm_id}`,
        name: result.display_name?.split(',')[0] || result.name || 'Unknown Location',
        position: [parseFloat(result.lat), parseFloat(result.lon)],
        type: 'search_result',
        description: result.display_name || result.name || '',
        category: result.type || 'Location',
        rating: 4.0,
        source: 'search'
      })),
      ...nearbyPOIs.map(poi => ({
        id: `poi_${poi.id}`,
        name: poi.name || 'Unknown POI',
        position: [poi.lat, poi.lon],
        type: poi.type || 'poi',
        description: poi.tags?.description || `${poi.category} in the area`,
        category: poi.category || 'POI',
        rating: 4.0,
        distance: poi.distance,
        tags: poi.tags,
        source: 'poi'
      })),
      // Include static data for immediate suggestions
      ...sabahLocations.attractions.map(location => ({
        id: `static_${location.id}`,
        name: location.name,
        position: location.position,
        type: location.type,
        description: location.description,
        category: location.category,
        rating: location.rating,
        source: 'static'
      })),
      ...sabahLocations.events.map(location => ({
        id: `static_${location.id}`,
        name: location.name,
        position: location.position,
        type: location.type,
        description: location.description,
        category: location.category,
        rating: 4.0,
        source: 'static'
      })),
      ...popularDestinations.map((dest, index) => ({
        id: `popular_${index}`,
        name: dest.name,
        position: dest.position, // Use actual coordinates
        type: dest.type,
        description: dest.address,
        category: dest.type,
        rating: 4.0,
        source: 'popular'
      }))
    ];
    
    return allLocations.filter(location => {
      const matchesSearch = !searchQuery || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.includes('all') ||
                             selectedCategories.includes(location.category) ||
                             selectedCategories.includes(location.type);
      
      return matchesSearch && matchesCategory;
    });
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter location suggestions for autocomplete with Sabah-specific search
  const filterLocationSuggestions = async (query) => {
    if (!query || query.length < 2) return [];
    
    // Static Sabah-specific suggestions
    const staticSuggestions = [
      { name: 'Current Location', type: 'GPS Location', isCurrentLocation: true },
      ...popularDestinations.map(loc => ({ 
        name: loc.name, 
        type: loc.type, 
        description: loc.address,
        position: loc.position,
        source: 'static',
        priority: 1 // Highest priority for popular destinations
      })),
      ...sabahLocations.attractions.map(loc => ({ 
        name: loc.name, 
        type: loc.category, 
        description: loc.description,
        position: loc.position,
        source: 'static',
        priority: 2
      })),
      ...sabahLocations.events.map(loc => ({ 
        name: loc.name, 
        type: loc.category, 
        description: loc.description,
        position: loc.position,
        source: 'static',
        priority: 3
      }))
    ];
    
    // Filter static suggestions with better matching
    const filteredStatic = staticSuggestions
      .filter(location => {
        const nameMatch = location.name.toLowerCase().includes(query.toLowerCase());
        const descMatch = location.description && location.description.toLowerCase().includes(query.toLowerCase());
        const exactMatch = location.name.toLowerCase() === query.toLowerCase();
        const startsWith = location.name.toLowerCase().startsWith(query.toLowerCase());
        
        // Boost exact matches and starts-with matches
        if (exactMatch) location.matchScore = 100;
        else if (startsWith) location.matchScore = 80;
        else if (nameMatch) location.matchScore = 60;
        else if (descMatch) location.matchScore = 40;
        else location.matchScore = 0;
        
        return nameMatch || descMatch;
      })
      .sort((a, b) => {
        // Sort by match score first, then by priority
        if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
        return a.priority - b.priority;
      });
    
    // Search Sabah-specific locations via API
    try {
      const sabahQuery = `${query}, Sabah, Malaysia`;
      const apiResponse = await apiService.searchLocations(sabahQuery);
      
      let apiSuggestions = [];
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        // Sabah approximate boundaries for validation
        const sabahBounds = {
          north: 7.5,
          south: 4.0,
          east: 119.5,
          west: 115.0
        };
        
        apiSuggestions = apiResponse.data
          .filter(result => {
            const displayName = result.display_name?.toLowerCase() || '';
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            
            // Check if coordinates are within Sabah bounds
            const withinSabah = lat >= sabahBounds.south && lat <= sabahBounds.north &&
                               lon >= sabahBounds.west && lon <= sabahBounds.east;
            
            // Only include results that mention Sabah/Malaysia AND are within geographic bounds
            return (displayName.includes('sabah') || displayName.includes('malaysia')) && withinSabah;
          })
          .map(result => {
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            const name = result.display_name?.split(',')[0] || result.name || 'Unknown Location';
            
            // Check if this API result conflicts with static data
             const staticMatch = filteredStatic.find(staticItem => 
               staticItem.name.toLowerCase() === name.toLowerCase()
             );
            
            let validationScore = 50; // Base score for API results
            
            if (staticMatch) {
              // Calculate distance between API result and static data
              const distance = calculateDistance(
                lat, lon,
                staticMatch.position[0], staticMatch.position[1]
              );
              
              // If API result is very close to static data (within 1km), boost it
              // If it's far (>5km), penalize it heavily
              if (distance < 1) validationScore = 70;
              else if (distance > 5) validationScore = 10;
              else validationScore = 30;
            }
            
            return {
              name: name,
              type: result.type || 'Location',
              description: result.display_name || result.name || '',
              position: [lat, lon],
              source: 'api',
              validationScore: validationScore,
              matchScore: name.toLowerCase().includes(query.toLowerCase()) ? 50 : 30
            };
          })
          .sort((a, b) => b.validationScore - a.validationScore)
          .slice(0, 3); // Limit API results to 3 best validated ones
      }
      
      // Combine and deduplicate suggestions, prioritizing static data
      const allSuggestions = [...filteredStatic, ...apiSuggestions];
      const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => {
        const firstIndex = self.findIndex(s => s.name.toLowerCase() === suggestion.name.toLowerCase());
        // Keep the first occurrence (static data has priority)
        if (index === firstIndex) return true;
        
        // If this is an API suggestion and there's already a static suggestion with same name,
        // only keep the API suggestion if it's more specific (contains more location details)
        const firstSuggestion = self[firstIndex];
        if (firstSuggestion.source === 'static' && suggestion.source === 'api') {
          return false; // Always prefer static data over API for same name
        }
        
        return false;
      });
      
      // Sort by relevance: match score, then validation score, then source priority
       const sortedSuggestions = uniqueSuggestions.sort((a, b) => {
         // First priority: match score (exact matches, starts with, etc.)
         if (a.matchScore !== b.matchScore) {
           return (b.matchScore || 0) - (a.matchScore || 0);
         }
         
         // Second priority: validation score (for API results)
         if (a.validationScore !== b.validationScore) {
           return (b.validationScore || 0) - (a.validationScore || 0);
         }
         
         // Third priority: source (static over API)
         if (a.source === 'static' && b.source === 'api') return -1;
         if (a.source === 'api' && b.source === 'static') return 1;
         
         // Fourth priority: priority level (for static results)
         if (a.priority !== b.priority) {
           return (a.priority || 999) - (b.priority || 999);
         }
         
         return 0;
       });
      
      return sortedSuggestions.slice(0, 8); // Limit to 8 total suggestions
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return filteredStatic.slice(0, 8);
    }
  };

  // Handle location input changes with async suggestions
  const handleFromLocationChange = async (value) => {
    setFromLocation(value);
    if (value.length >= 2) {
      try {
        const suggestions = await filterLocationSuggestions(value);
        setFromSuggestions(suggestions);
        setShowFromSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Error getting from location suggestions:', error);
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      }
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToLocationChange = async (value) => {
    setToLocation(value);
    if (value.length >= 2) {
      try {
        const suggestions = await filterLocationSuggestions(value);
        setToSuggestions(suggestions);
        setShowToSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Error getting to location suggestions:', error);
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  // Handle suggestion selection with position data
  const handleFromSuggestionSelect = (suggestion) => {
    setFromLocation(suggestion.name);
    setShowFromSuggestions(false);
    setFromSuggestions([]);
    
    // Store position data for route planning
    if (suggestion.position) {
      setFromLocationData({
        name: suggestion.name,
        position: suggestion.position,
        type: suggestion.type
      });
    } else if (suggestion.isCurrentLocation && userLocation) {
      setFromLocationData({
        name: 'Current Location',
        position: [userLocation.lat, userLocation.lng],
        type: 'GPS Location'
      });
    }
  };

  const handleToSuggestionSelect = (suggestion) => {
    setToLocation(suggestion.name);
    setShowToSuggestions(false);
    setToSuggestions([]);
    
    // Store position data for route planning
    if (suggestion.position) {
      setToLocationData({
        name: suggestion.name,
        position: suggestion.position,
        type: suggestion.type
      });
    } else if (suggestion.isCurrentLocation && userLocation) {
      setToLocationData({
        name: 'Current Location',
        position: [userLocation.lat, userLocation.lng],
        type: 'GPS Location'
      });
    }
  };
  
  const handleNavigateToLocation = (location) => {
    if (!userLocation) {
      setLocationError('Please enable location services to get directions');
      return;
    }
    
    setIsNavigating(true);
    setSelectedLocation(location);
    
    // Simulate navigation (in real app, integrate with routing service)
    setTimeout(() => {
      setIsNavigating(false);
      alert(`Navigation started to ${location.name}`);
    }, 2000);
  };
  
  // Helper function to geocode location names to coordinates
  const geocodeLocation = async (locationName) => {
    if (locationName === 'Current Location' && userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', Sabah, Malaysia')}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  // Helper function to decode polyline geometry
  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([lat / 1e5, lng / 1e5]);
    }

    return points;
  };

  // Navigation functions
  const handlePlanRoute = async () => {
    if (!fromLocation || !toLocation) {
      alert('Please enter both from and to locations');
      return;
    }

    // Check if we have location data with coordinates
    if (!fromLocationData || !toLocationData) {
      alert('Please select locations from the suggestions to plan a route');
      return;
    }

    setRouteLoading(true);
    try {
      // Remove existing route if any
      if (routingControl && mapRef.current) {
        if (routingControl.routeLine) {
          mapRef.current.removeLayer(routingControl.routeLine);
        } else {
          mapRef.current.removeControl(routingControl);
        }
        setRoutingControl(null);
      }

      // Use stored location coordinates
      const fromCoords = fromLocationData.position;
      const toCoords = toLocationData.position;
      
      if (!mapRef.current) {
        throw new Error('Map not available');
      }

      // Get route from backend API
      const response = await apiService.getRoute(
        fromCoords[0], fromCoords[1], // lat, lon for start
        toCoords[0], toCoords[1],     // lat, lon for end
        selectedTransport === 'car' ? 'driving' : selectedTransport
      );

      if (response.success && response.data) {
        const route = response.data;
        
        // Get route coordinates from geometry
        let routeCoords;
        if (route.geometry && route.geometry.coordinates) {
          // GeoJSON format - coordinates are [lon, lat], we need [lat, lon]
          routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        } else if (typeof route.geometry === 'string') {
          // Polyline encoded format
          routeCoords = decodePolyline(route.geometry);
        } else {
          throw new Error('Invalid route geometry format');
        }
        
        // Create a polyline for the route
        const routeLine = L.polyline(routeCoords, {
          color: selectedTransport === 'walk' ? '#4CAF50' : 
                 selectedTransport === 'car' ? '#2196F3' : '#FF9800',
          weight: 6,
          opacity: 0.8
        }).addTo(mapRef.current);
        
        // Store route info
        const distance = (route.distance / 1000).toFixed(1) + ' km';
        const duration = Math.round(route.duration / 60) + ' min';
        
        setRoutes([{
          distance,
          duration,
          coordinates: routeCoords
        }]);
        
        // Fit map to route bounds
        mapRef.current.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
        
        // Store the route line for cleanup
        setRoutingControl({ routeLine });
      } else {
        throw new Error('No route found');
      }
      
    } catch (error) {
      console.error('Route planning failed:', error);
      alert('Failed to plan route. Please check the location names and try again.');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleTransportChange = (transportId) => {
    setSelectedTransport(transportId);
    if (routingControl && routes.length > 0) {
      handlePlanRoute(); // Recalculate route with new transport mode
    }
  };

  // Cleanup routing control on unmount
  useEffect(() => {
    return () => {
      if (routingControl && mapRef.current) {
        if (routingControl.routeLine) {
          mapRef.current.removeLayer(routingControl.routeLine);
        } else {
          mapRef.current.removeControl(routingControl);
        }
      }
    };
  }, [routingControl]);

  const handleDestinationSelect = (destination) => {
    setToLocation(destination.name);
  };

  const handleUseCurrentLocation = () => {
    console.log('handleUseCurrentLocation called, userLocation:', userLocation);
    if (userLocation) {
      setFromLocation('Current Location');
    } else {
      // Show message to user to enable location manually
      console.log('Location not available. User needs to enable location manually.');
      setLocationError('Please enable location access using the location button to use navigation features.');
    }
  };
  
  const getCurrentLocation = () => {
    console.log('getCurrentLocation called');
    if (navigator.geolocation) {
      console.log('Geolocation is supported');
      // Clear any previous errors
      setLocationError(null);
      
      console.log('Calling navigator.geolocation.getCurrentPosition...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latlng = { lat: latitude, lng: longitude };
          setUserLocation(latlng);
          setLocationError(null);
          
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
          
          console.log('Location found:', latlng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your location. ';
          let suggestions = '';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access was denied.';
              suggestions = 'Please: 1) Click the location icon in your browser\'s address bar, 2) Select "Allow" for location access, 3) Refresh the page and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Your location could not be determined.';
              suggestions = 'Please: 1) Check if location services are enabled on your device, 2) Try moving to an area with better GPS signal, 3) Refresh the page and try again.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              suggestions = 'Please try again. If the problem persists, check your internet connection.';
              break;
            default:
              errorMessage += `An unknown error occurred (Code: ${error.code}).`;
              suggestions = 'Please refresh the page and try again.';
              break;
          }
          
          setLocationError(`${errorMessage} ${suggestions}`);
        },
        {
          enableHighAccuracy: false, // Changed to false for better compatibility
          timeout: 15000, // Increased timeout
          maximumAge: 300000 // 5 minutes cache
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
    }
  };
  
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* Navigation Sidebar */}
      <Paper 
         elevation={3}
         sx={{
           width: navigationOpen ? 350 : 60,
           height: 'calc(100vh - 64px)',
           transition: 'width 0.3s ease',
           display: 'flex',
           flexDirection: 'column',
           zIndex: 1100,
           backgroundColor: '#ffffff',
           borderRadius: 0,
           borderRight: '1px solid rgba(0, 0, 0, 0.12)',
           position: 'absolute',
           left: 0,
           top: 64,
           pointerEvents: 'auto'
         }}
      >
        {/* Navigation Toggle Button */}
        <Box sx={{ p: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <IconButton 
              onClick={() => setNavigationOpen(!navigationOpen)}
              sx={{ 
                width: '100%',
                justifyContent: navigationOpen ? 'flex-start' : 'center',
                display: 'flex',
                gap: 1,
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <NavigationIcon />
              {navigationOpen && (
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#072B80', textTransform: 'uppercase' }}>
                  Navigation
                </Typography>
              )}
            </IconButton>
        </Box>

        {/* Navigation Content */}
        {navigationOpen && (
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RouteIcon color="primary" />
              Route Planner
            </Typography>

            {/* From/To Inputs */}
            <Box sx={{ mb: 3 }}>
              {/* From Location Input */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box ref={fromInputRef} sx={{ position: 'relative', flex: 1 }}>
                  <TextField
                    fullWidth
                    label="From"
                    value={fromLocation}
                    onChange={(e) => handleFromLocationChange(e.target.value)}
                    onFocus={() => {
                      if (fromLocation.length >= 2) {
                        setShowFromSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding to allow click on suggestions
                      setTimeout(() => setShowFromSuggestions(false), 200);
                    }}
                    size="small"
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                  
                  {/* From Location Suggestions */}
                  {showFromSuggestions && fromSuggestions.length > 0 && (
                    <Paper
                      elevation={4}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1200,
                        maxHeight: 200,
                        overflow: 'auto',
                        mt: 0.5
                      }}
                    >
                      {fromSuggestions.map((suggestion, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            borderBottom: index < fromSuggestions.length - 1 ? '1px solid #eee' : 'none',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                          onClick={() => handleFromSuggestionSelect(suggestion)}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {suggestion.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {suggestion.type}{suggestion.address && ` • ${suggestion.address}`}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  )}
                </Box>
                
                <IconButton 
                  onClick={handleUseCurrentLocation}
                  size="small"
                  title="Use current location"
                >
                  <MyLocationIcon />
                </IconButton>
              </Box>
              
              {/* To Location Input */}
              <Box ref={toInputRef} sx={{ position: 'relative', mb: 2 }}>
                <TextField
                  fullWidth
                  label="To"
                  value={toLocation}
                  onChange={(e) => handleToLocationChange(e.target.value)}
                  onFocus={() => {
                    if (toLocation.length >= 2) {
                      setShowToSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow click on suggestions
                    setTimeout(() => setShowToSuggestions(false), 200);
                  }}
                  size="small"
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
                
                {/* To Location Suggestions */}
                {showToSuggestions && toSuggestions.length > 0 && (
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1200,
                      maxHeight: 200,
                      overflow: 'auto',
                      mt: 0.5
                    }}
                  >
                    {toSuggestions.map((suggestion, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          borderBottom: index < toSuggestions.length - 1 ? '1px solid #eee' : 'none',
                          '&:hover': {
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                        onClick={() => handleToSuggestionSelect(suggestion)}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {suggestion.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {suggestion.type}{suggestion.address && ` • ${suggestion.address}`}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>
            </Box>

            {/* Transport Mode Selection */}
            <Typography variant="subtitle2" gutterBottom>
              Transport Mode
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 3 }}>
              {transportModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <Button
                    key={mode.id}
                    variant={selectedTransport === mode.id ? 'contained' : 'outlined'}
                    onClick={() => handleTransportChange(mode.id)}
                    startIcon={<IconComponent />}
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      backgroundColor: selectedTransport === mode.id ? mode.color : 'transparent',
                      borderColor: mode.color,
                      color: selectedTransport === mode.id ? 'white' : mode.color,
                      '&:hover': {
                        backgroundColor: selectedTransport === mode.id ? mode.color : `${mode.color}20`
                      }
                    }}
                  >
                    {mode.name}
                  </Button>
                );
              })}
            </Box>

            {/* Plan Route Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handlePlanRoute}
              disabled={routeLoading || !fromLocation || !toLocation}
              startIcon={routeLoading ? <CircularProgress size={20} /> : <DirectionsIcon />}
              sx={{ mb: 3 }}
            >
              {routeLoading ? 'Planning Route...' : 'Plan Route'}
            </Button>

            {/* Route Results */}
            {routes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Route Information
                </Typography>
                {routes.map((route, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: 'rgba(25, 118, 210, 0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Chip 
                        icon={<TimeIcon />} 
                        label={route.duration} 
                        size="small" 
                        color="primary" 
                      />
                      <Chip 
                        icon={<RouteIcon />} 
                        label={route.distance} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Estimated travel time via {transportModes.find(m => m.id === selectedTransport)?.name.toLowerCase()}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Popular Destinations */}
            <Typography variant="subtitle2" gutterBottom>
              Popular Destinations
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {popularDestinations.map((destination, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                  onClick={() => handleDestinationSelect(destination)}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {destination.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {destination.type} • {destination.address}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Main Map Area */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        {/* Search and Filter Bar */}
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'absolute', 
            top: 84, 
            left: navigationOpen ? 370 : 80, 
            right: 20, 
            zIndex: 1000, 
            p: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
            transition: 'left 0.3s ease'
          }}
        >
        <Box ref={searchRef} sx={{ position: 'relative', minWidth: 250, flex: 1 }}>
          <TextField
            placeholder="Search attractions, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Search Results Dropdown */}
          {searchQuery && searchQuery.length >= 2 && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1001,
                maxHeight: 300,
                overflow: 'auto',
                mt: 1
              }}
            >
              {searchLoading && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>Searching...</Typography>
                </Box>
              )}
              
              {!searchLoading && filteredLocations().length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No results found for "{searchQuery}"
                  </Typography>
                </Box>
              )}
              
              {!searchLoading && filteredLocations().slice(0, 5).map((location) => (
                <Box
                  key={location.id}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    },
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.setView(location.position, 15);
                    }
                    setSearchQuery('');
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {location.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {location.description}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip 
                      label={location.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
          
          {/* No Results Message */}
          {searchQuery && filteredLocations().length === 0 && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1001,
                p: 2,
                mt: 1
              }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No locations found for "{searchQuery}"
              </Typography>
            </Paper>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryToggle(category)}
              color={selectedCategories.includes(category) ? 'primary' : 'default'}
              variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
        
        <IconButton onClick={() => setDrawerOpen(true)} color="primary">
          <FilterIcon />
        </IconButton>
        </Paper>
        
        {/* Error Alert */}
        {locationError && (
          <Alert 
            severity="warning" 
            sx={{ 
              position: 'absolute', 
              top: 150, 
              left: navigationOpen ? 370 : 80, 
              right: 20, 
              zIndex: 1000,
              transition: 'left 0.3s ease'
            }}
            onClose={() => setLocationError(null)}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => {
                  setLocationError(null);
                  getCurrentLocation();
                }}
              >
                Retry
              </Button>
            }
          >
            {locationError}
          </Alert>
        )}
        
        {/* Map Container */}
         <Box sx={{ height: '100%', position: 'relative' }}>
        <MapContainer
          center={[5.9804, 116.0735]} // Kota Kinabalu coordinates
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapController 
            onLocationFound={handleLocationFound}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            mapRef={mapRef}
          />
          
          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#2196F3', '👤')}
            >
              <Popup>
                <Typography variant="body2" fontWeight="bold">
                  Your Location
                </Typography>
              </Popup>
            </Marker>
          )}
          
          {/* Location Markers */}
          {filteredLocations().map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              icon={createCustomIcon(
                location.type === 'event' ? '#FF5722' : '#4CAF50',
                location.type === 'event' ? '🎉' : '📍'
              )}
            >
              <Popup>
                <Card 
                  sx={{ minWidth: 250, maxWidth: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {location.description}
                    </Typography>
                    <Chip 
                      label={location.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 1 }}
                    />
                    {location.rating && (
                      <Typography variant="body2">
                        ⭐ {location.rating}/5
                      </Typography>
                    )}
                    {location.date && (
                      <Typography variant="body2" color="primary">
                        📅 {location.date}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<DirectionsIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToLocation(location);
                      }}
                      disabled={!userLocation || isNavigating}
                    >
                      {isNavigating && selectedLocation?.id === location.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        'Get Directions'
                      )}
                    </Button>
                  </CardActions>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
      
      {/* Floating Action Button for Current Location */}
      <Fab
        color="primary"
        sx={{ 
          position: 'absolute', 
          bottom: 20, 
          right: 20, 
          zIndex: 1000,
          backgroundColor: userLocation ? '#4caf50' : '#1976d2'
        }}
        onClick={() => {
          console.log('FAB button clicked, userLocation:', userLocation);
          if (userLocation) {
            // If location is already available, just center the map
            console.log('Centering map on existing location');
            if (mapRef.current) {
              mapRef.current.setView([userLocation.lat, userLocation.lng], 16);
            }
          } else {
            // Only request location if not already available
            console.log('Requesting current location...');
            getCurrentLocation();
          }
        }}
      >
        <MyLocationIcon />
      </Fab>
      
      {/* Location Details Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { maxHeight: '50vh' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Explore Sabah</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {filteredLocations().map((location) => (
              <ListItem key={location.id} divider>
                <ListItemIcon>
                  {location.type === 'event' ? <EventIcon color="error" /> : <PlaceIcon color="success" />}
                </ListItemIcon>
                <ListItemText
                  primary={location.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {location.description}
                      </Typography>
                      <Chip label={location.category} size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  }
                />
                <Button
                  size="small"
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.setView(location.position, 15);
                      setDrawerOpen(false);
                    }
                  }}
                >
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
       </Box>
     </Box>
   </Box>
  );
};

export default Map;