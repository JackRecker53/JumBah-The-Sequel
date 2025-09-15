#!/bin/bash

echo "========================================"
echo "   JumBah Travel Application Setup"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from your package manager or https://python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from your package manager or https://nodejs.org"
    exit 1
fi

echo "✓ Python and Node.js are installed"
echo

# Setup Backend
echo "Setting up Backend..."
cd Backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "✓ Backend setup complete"
echo

# Setup Frontend
echo "Setting up Frontend..."
cd ../Frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✓ Frontend setup complete"
echo

# Create .env file if it doesn't exist
cd ../Backend
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# JumBah Backend Environment Variables
# Add your API keys and configuration here
GOOGLE_API_KEY=your_google_api_key_here
DATABASE_URL=sqlite:///./jumbah.db
SECRET_KEY=your_secret_key_here
EOF
    echo
    echo "⚠️  Please edit Backend/.env file with your actual API keys"
fi

cd ..

echo
echo "========================================"
echo "    Setup Complete!"
echo "========================================"
echo
echo "To start the application:"
echo "1. Backend: cd Backend && source venv/bin/activate && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo "2. Frontend: cd Frontend && npm run dev"
echo
echo "The application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
echo