# 🏗️ JumBah Architecture & Page Documentation

This document provides a comprehensive overview of how JumBah's pages work, the application architecture, and the interaction between frontend and backend components.

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Page-by-Page Breakdown](#page-by-page-breakdown)
5. [Data Flow](#data-flow)
6. [API Integration](#api-integration)
7. [State Management](#state-management)
8. [Performance Optimizations](#performance-optimizations)

## 🏛️ System Architecture

JumBah follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  External APIs  │
│   (React)       │◄──►│   (FastAPI)     │◄──►│  (Google AI,    │
│   Port: 5173    │    │   Port: 8000    │    │   Weather, etc) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Communication Flow
- **Frontend ↔ Backend**: RESTful API calls over HTTP
- **Backend ↔ External APIs**: HTTP requests for AI, weather, and location data
- **Real-time Features**: WebSocket connections for live updates (future enhancement)

## 🎨 Frontend Architecture

### Technology Stack
- **React 19.1.1**: Component-based UI framework
- **Material-UI (MUI)**: Pre-built components and theming
- **Framer Motion**: Animation and page transitions
- **React Router**: Client-side routing
- **Leaflet**: Interactive mapping
- **Tailwind CSS**: Utility-first styling

### Project Structure
```
Frontend/src/
├── Pages/              # Main application pages
├── components/         # Reusable UI components
├── contexts/           # React context providers
├── services/           # API integration layer
├── utils/              # Helper functions
├── assets/             # Static assets
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

### Routing System
The application uses React Router with animated transitions:

```jsx
// App.jsx - Main routing configuration
<Routes location={location} key={location.pathname}>
  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
  <Route path="/adventure" element={<PageTransition><Game /></PageTransition>} />
  <Route path="/aiplanner" element={<PageTransition><AIPlanner /></PageTransition>} />
  <Route path="/map" element={<PageTransition><Map /></PageTransition>} />
  <Route path="/about" element={<PageTransition><About /></PageTransition>} />
</Routes>
```

## ⚙️ Backend Architecture

### Technology Stack
- **FastAPI**: Modern Python web framework
- **Uvicorn**: ASGI server for production
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation and serialization
- **Google Generative AI**: AI-powered content generation

### Project Structure
```
Backend/
├── routers/            # API route handlers
│   ├── ai_planner.py   # AI trip planning endpoints
│   ├── locations.py    # Location and mapping APIs
│   ├── weather.py      # Weather data integration
│   ├── users.py        # User management
│   └── ai_content.py   # AI content generation
├── services/           # Business logic layer
├── models/             # Database models
├── utils/              # Utility functions
├── main.py             # FastAPI application entry
└── requirements.txt    # Python dependencies
```

### API Design
RESTful API following OpenAPI 3.0 specification:
- **Automatic Documentation**: Available at `/docs` and `/redoc`
- **Type Safety**: Pydantic models for request/response validation
- **Error Handling**: Consistent error responses with proper HTTP status codes

## 📱 Page-by-Page Breakdown

### 🏠 Home Page (`/`)

**Purpose**: Landing page that introduces users to JumBah and provides navigation to main features.

**Key Components**:
- **Hero Section**: Stunning visuals of Sabah with call-to-action
- **Feature Cards**: Quick access to main application features
- **Destination Highlights**: Featured locations and experiences
- **Navigation Bar**: Persistent navigation across the application

**Technical Implementation**:
```jsx
// Home.jsx structure
const Home = () => {
  return (
    <Box>
      <HeroSection />           // Main banner with CTA
      <FeaturesSection />       // Feature cards grid
      <DestinationsSection />   // Featured destinations
      <TestimonialsSection />   // User testimonials
    </Box>
  );
};
```

**Data Sources**:
- Static content for hero and features
- Dynamic destination data from backend API
- User testimonials from database

**Interactions**:
- Navigation to other pages
- Smooth scrolling between sections
- Responsive design for mobile/desktop

---

### 🤖 AI Planner Page (`/aiplanner`)

**Purpose**: Interactive AI-powered trip planning interface where users can chat with an AI assistant to create personalized itineraries.

**Key Components**:
- **Chat Interface**: Real-time conversation with AI
- **Preference Form**: User inputs for trip customization
- **Itinerary Display**: Generated trip plans with timeline
- **Map Integration**: Visual representation of planned routes

**Technical Implementation**:
```jsx
// AIPlanner.jsx structure
const AIPlanner = () => {
  const [messages, setMessages] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const handleSendMessage = async (message) => {
    // Send message to AI backend
    const response = await aiPlannerService.sendMessage(message);
    setMessages(prev => [...prev, response]);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ItineraryDisplay itinerary={generatedItinerary} />
      </Grid>
    </Grid>
  );
};
```

**Backend Integration**:
- `POST /api/ai-planner/chat` - Send messages to AI
- `POST /api/ai-planner/generate` - Generate complete itinerary
- `GET /api/ai-planner/suggestions` - Get travel suggestions

**AI Features**:
- **Natural Language Processing**: Understanding user preferences
- **Context Awareness**: Maintaining conversation context
- **Personalization**: Tailored recommendations based on user data
- **Weather Integration**: Real-time weather considerations

**State Management**:
- Chat history stored in component state
- User preferences persisted in localStorage
- Generated itineraries cached for quick access

---

### 🗺️ Interactive Map Page (`/map`)

**Purpose**: Comprehensive mapping solution for navigation, location discovery, and route planning.

**Key Components**:
- **Interactive Map**: Leaflet-based map with zoom/pan controls
- **Location Search**: Find specific places and attractions
- **Route Planning**: Calculate optimal paths between destinations
- **Points of Interest**: Discover nearby attractions and services

**Technical Implementation**:
```jsx
// map.jsx structure
const Map = () => {
  const [mapCenter, setMapCenter] = useState([5.9804, 116.0735]); // Sabah coordinates
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <Box>
      <MapContainer center={mapCenter} zoom={10}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.info}</Popup>
          </Marker>
        ))}
        {route && <Polyline positions={route.coordinates} />}
      </MapContainer>
      <LocationSearch onLocationSelect={handleLocationSelect} />
      <RoutePanel route={route} />
    </Box>
  );
};
```

**Backend Integration**:
- `GET /api/locations/search` - Search for places
- `GET /api/locations/nearby` - Find nearby attractions
- `POST /api/locations/route` - Calculate routes
- `GET /api/locations/poi` - Get points of interest

**Map Features**:
- **Real-time Location**: GPS tracking for current position
- **Custom Markers**: Different icons for various location types
- **Clustering**: Group nearby markers for better performance
- **Offline Support**: Cached map tiles for offline use

**Performance Optimizations**:
- **Lazy Loading**: Load map tiles on demand
- **Marker Clustering**: Reduce DOM elements for large datasets
- **Debounced Search**: Prevent excessive API calls during typing

---

### 🎮 Adventure Game Page (`/adventure`)

**Purpose**: Gamified exploration experience that turns travel into an interactive adventure with challenges and rewards.

**Key Components**:
- **Game Dashboard**: Progress tracking and achievement display
- **QR Code Scanner**: Scan location-based codes for content
- **Challenge System**: Cultural and educational mini-games
- **Achievement Gallery**: Badges and rewards collection

**Technical Implementation**:
```jsx
// game.jsx structure
const Game = () => {
  const [userProgress, setUserProgress] = useState({});
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);

  const handleQRScan = async (qrData) => {
    // Process QR code data
    const challengeData = await gameService.processQRCode(qrData);
    setActiveChallenge(challengeData);
  };

  return (
    <Container>
      <GameDashboard progress={userProgress} />
      <QRScanner 
        active={scannerActive}
        onScan={handleQRScan}
      />
      <ChallengeModal 
        challenge={activeChallenge}
        onComplete={handleChallengeComplete}
      />
      <AchievementGallery achievements={achievements} />
    </Container>
  );
};
```

**Game Mechanics**:
- **Point System**: Earn points for completing challenges
- **Level Progression**: Unlock new areas and content
- **Social Features**: Share achievements with friends
- **Educational Content**: Learn about Sabah's culture and history

**QR Code Integration**:
- **Location-based Content**: Unique experiences at specific locations
- **Challenge Triggers**: Start mini-games by scanning codes
- **Information Access**: Get detailed information about landmarks

---

### ℹ️ About Page (`/about`)

**Purpose**: Information hub about JumBah, its mission, features, and the team behind it.

**Key Components**:
- **Mission Statement**: Vision and goals of the application
- **Feature Overview**: Detailed explanation of capabilities
- **Team Information**: Meet the developers and contributors
- **Contact Section**: Support and feedback channels

**Technical Implementation**:
```jsx
// about.jsx structure
const About = () => {
  return (
    <Container>
      <HeroSection />
      <MissionSection />
      <FeaturesGrid />
      <TeamSection />
      <ContactSection />
      <CTASection />  {/* Call-to-action with Sabah gradient button */}
    </Container>
  );
};
```

**Design Features**:
- **Sabah Gradient**: Beautiful gradient reflecting Sabah's colors
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Framer Motion transitions
- **Interactive Elements**: Hover effects and micro-interactions

## 🔄 Data Flow

### Frontend to Backend Communication

```
User Action → Component State → API Service → Backend Endpoint → Database/External API
     ↓              ↓              ↓              ↓                    ↓
Response ← UI Update ← State Update ← API Response ← Processed Data ← Raw Data
```

### Example: AI Chat Flow
1. **User types message** in chat interface
2. **Component state updates** with new message
3. **API service** sends request to `/api/ai-planner/chat`
4. **Backend processes** message with Google AI
5. **AI response** returned to frontend
6. **UI updates** with AI response in chat

### Example: Map Location Search
1. **User searches** for location
2. **Debounced search** triggers API call
3. **Backend queries** location service
4. **Results returned** with coordinates
5. **Map updates** with new markers
6. **UI shows** search results

## 🔌 API Integration

### Service Layer Pattern
Each page uses dedicated service modules for API communication:

```javascript
// services/aiPlannerService.js
export const aiPlannerService = {
  async sendMessage(message) {
    const response = await fetch('/api/ai-planner/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return response.json();
  },

  async generateItinerary(preferences) {
    const response = await fetch('/api/ai-planner/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    return response.json();
  }
};
```

### Error Handling
Consistent error handling across all API calls:

```javascript
// utils/apiUtils.js
export const handleApiError = (error) => {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status >= 500) {
    // Show server error message
  } else {
    // Show generic error
  }
};
```

## 🏪 State Management

### Component-Level State
- **Local state** for UI interactions
- **useEffect** for side effects and API calls
- **Custom hooks** for reusable logic

### Context API
- **User context** for authentication state
- **Theme context** for UI theming
- **Location context** for GPS data

### Local Storage
- **User preferences** persisted across sessions
- **Chat history** cached for quick access
- **Map settings** remembered between visits

## ⚡ Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy load pages with React.lazy()
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer for size optimization
- **Memoization**: React.memo for expensive components

### Backend Optimizations
- **Database Indexing**: Optimized queries for location data
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Rate Limiting**: Prevent API abuse

### Network Optimizations
- **API Response Compression**: Gzip compression enabled
- **CDN Integration**: Static assets served from CDN
- **Request Batching**: Combine multiple API calls
- **Offline Support**: Service worker for offline functionality

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Share trips with friends
- **Voice Interface**: Voice commands for hands-free use
- **AR Integration**: Augmented reality for location information
- **Machine Learning**: Personalized recommendations

### Technical Improvements
- **Progressive Web App**: Full PWA capabilities
- **WebSocket Integration**: Real-time updates
- **Microservices**: Split backend into smaller services
- **GraphQL**: More efficient data fetching

---

This architecture documentation provides a comprehensive overview of how JumBah works. Each page is designed with specific user needs in mind while maintaining consistent patterns and performance standards throughout the application.