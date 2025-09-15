# 🌴 JumBah - Your Adventure Companion in Sabah

**JumBah-The-Sequel** is a comprehensive travel application designed to enhance your exploration of Sabah, Malaysia. This full-stack web application combines AI-powered trip planning, interactive mapping, cultural exploration, and gamified experiences to create the ultimate travel companion.

![Sabah Gradient](https://img.shields.io/badge/Powered%20by-Sabah%20Spirit-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

## 🚀 Features

### 🤖 AI-Powered Trip Planning
- **Smart Itinerary Generation**: Get personalized travel plans based on your preferences
- **Cultural Insights**: Discover local customs, traditions, and hidden gems
- **Weather Integration**: Real-time weather data for optimal trip planning
- **Interactive Chat**: Conversational AI assistant for travel queries

### 🗺️ Interactive Mapping
- **Real-time Navigation**: Integrated with Leaflet for precise location services
- **Route Planning**: Optimized paths between destinations
- **Points of Interest**: Discover attractions, restaurants, and cultural sites
- **Offline Capabilities**: Download maps for offline exploration

### 🎮 Gamified Experience
- **Adventure Mode**: Turn your travels into an interactive game
- **Cultural Challenges**: Learn about Sabah through engaging activities
- **Achievement System**: Unlock badges and rewards for exploration
- **QR Code Integration**: Scan locations for special content

### 🏛️ Cultural Exploration
- **Heritage Sites**: Detailed information about Sabah's rich history
- **Local Traditions**: Learn about indigenous cultures and practices
- **Food Discovery**: Explore authentic Sabahan cuisine
- **Language Learning**: Basic phrases in local languages

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **Material-UI (MUI)** - Component library for beautiful interfaces
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **FastAPI** - High-performance Python web framework
- **Uvicorn** - ASGI server for production
- **SQLAlchemy** - Database ORM
- **Google Generative AI** - AI-powered content generation
- **Geopy** - Geocoding and location services
- **Pandas & NumPy** - Data processing and analysis

### Development Tools
- **ESLint** - Code linting and formatting
- **Pytest** - Backend testing framework
- **Concurrently** - Run multiple commands simultaneously

## 📋 Prerequisites

Before setting up JumBah, ensure you have the following installed:

- **Python 3.8+** ([Download](https://python.org))
- **Node.js 16+** ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- **pip** (comes with Python)

## ⚡ Quick Start

### Option 1: Automated Setup (Recommended)

#### Windows
```bash
# Clone the repository
git clone https://github.com/your-username/JumBah-The-Sequel.git
cd JumBah-The-Sequel

# Run automated setup
setup.bat
```

#### Linux/Mac
```bash
# Clone the repository
git clone https://github.com/your-username/JumBah-The-Sequel.git
cd JumBah-The-Sequel

# Make setup script executable and run
chmod +x setup.sh
./setup.sh
```

#### Cross-Platform (Node.js)
```bash
# Check system requirements
npm run setup

# Install dependencies for both frontend and backend
npm run install:all

# Start both servers simultaneously
npm run dev
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd Backend

# Create virtual environment
python -m venv myenv

# Activate virtual environment
# Windows:
myenv\Scripts\activate
# Linux/Mac:
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your API keys
```

#### Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Google AI API Key (required for AI features)
GOOGLE_API_KEY=your_google_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///./jumbah.db

# Security
SECRET_KEY=your_secret_key_here

# Optional: External API Keys
WEATHER_API_KEY=your_weather_api_key
MAPS_API_KEY=your_maps_api_key
```

### API Keys Setup

1. **Google AI API Key**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

2. **Weather API** (Optional):
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key

## 🚀 Running the Application

### Development Mode

Start both servers:
```bash
npm run dev
```

Or start them separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API**: http://localhost:8000/redoc

## 📱 Application Pages

### 🏠 Home Page (`/`)
The landing page featuring:
- Hero section with Sabah's stunning visuals
- Quick navigation to main features
- Featured destinations and experiences
- Call-to-action for trip planning

### 🤖 AI Planner (`/aiplanner`)
Intelligent trip planning interface:
- Interactive chat with AI assistant
- Preference-based recommendations
- Itinerary generation and customization
- Integration with weather and location data

### 🗺️ Interactive Map (`/map`)
Comprehensive mapping solution:
- Real-time location tracking
- Points of interest discovery
- Route planning and navigation
- Offline map capabilities

### 🎮 Adventure Game (`/adventure`)
Gamified exploration experience:
- Cultural challenges and quests
- QR code scanning for location-based content
- Achievement and badge system
- Educational mini-games about Sabah

### ℹ️ About Page (`/about`)
Information about the application:
- Mission and vision
- Features overview
- Team information
- Contact details

## 🏗️ Project Architecture

```
JumBah-The-Sequel/
├── Backend/                 # Python FastAPI backend
│   ├── routers/            # API route handlers
│   │   ├── ai_planner.py   # AI trip planning endpoints
│   │   ├── locations.py    # Location and mapping APIs
│   │   ├── weather.py      # Weather data integration
│   │   ├── users.py        # User management
│   │   └── ai_content.py   # AI content generation
│   ├── services/           # Business logic layer
│   ├── models/             # Database models
│   ├── utils/              # Utility functions
│   ├── main.py             # FastAPI application entry
│   └── requirements.txt    # Python dependencies
│
├── Frontend/               # React frontend application
│   ├── src/
│   │   ├── Pages/          # Main application pages
│   │   │   ├── Home.jsx    # Landing page
│   │   │   ├── AIPlanner.jsx # AI trip planning
│   │   │   ├── map.jsx     # Interactive mapping
│   │   │   ├── game.jsx    # Adventure game
│   │   │   └── about.jsx   # About page
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── services/       # API integration
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Node.js dependencies
│
├── setup.bat               # Windows setup script
├── setup.sh                # Linux/Mac setup script
├── setup-check.js          # Cross-platform setup checker
└── package.json            # Root project configuration
```

## 🔄 API Endpoints

### Core Endpoints
- `GET /` - Health check and API information
- `GET /api/health` - System health status

### AI Planning
- `POST /api/ai-planner/generate` - Generate trip itinerary
- `POST /api/ai-planner/chat` - Interactive AI chat
- `GET /api/ai-planner/suggestions` - Get travel suggestions

### Location Services
- `GET /api/locations/search` - Search for places
- `GET /api/locations/nearby` - Find nearby attractions
- `POST /api/locations/route` - Calculate routes

### Weather Integration
- `GET /api/weather/current` - Current weather data
- `GET /api/weather/forecast` - Weather forecast

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - User profile data

## 🧪 Testing

### Frontend Testing
```bash
cd Frontend
npm run lint          # ESLint code checking
npm run build         # Production build test
```

### Backend Testing
```bash
cd Backend
source myenv/bin/activate  # or myenv\Scripts\activate on Windows
pytest                     # Run all tests
pytest -v                  # Verbose testing
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd Frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment
```bash
cd Backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

We welcome contributions to JumBah! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/JumBah-The-Sequel/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- **Sabah Tourism Board** - For inspiration and cultural insights
- **Local Communities** - For sharing their knowledge and traditions
- **Open Source Community** - For the amazing tools and libraries
- **Beta Testers** - For their valuable feedback and suggestions

---

**Made with ❤️ for Sabah travelers and adventure seekers**

*Explore. Discover. Experience. JumBah.*
