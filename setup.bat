@echo off
echo ========================================
echo    JumBah Travel Application Setup
echo ========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Python and Node.js are installed
echo.

:: Setup Backend
echo Setting up Backend...
cd Backend

:: Create virtual environment if it doesn't exist
if not exist "myenv" (
    echo Creating Python virtual environment...
    python -m venv myenv
)

:: Activate virtual environment and install dependencies
echo Activating virtual environment and installing dependencies...
call myenv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt

echo ✓ Backend setup complete
echo.

:: Setup Frontend
echo Setting up Frontend...
cd ..\Frontend

:: Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

echo ✓ Frontend setup complete
echo.

:: Create .env file if it doesn't exist
cd ..\Backend
if not exist ".env" (
    echo Creating .env file...
    echo # JumBah Backend Environment Variables > .env
    echo # Add your API keys and configuration here >> .env
    echo GOOGLE_API_KEY=your_google_api_key_here >> .env
    echo DATABASE_URL=sqlite:///./jumbah.db >> .env
    echo SECRET_KEY=your_secret_key_here >> .env
    echo.
    echo ⚠️  Please edit Backend\.env file with your actual API keys
)

cd ..

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Backend: cd Backend && myenv\Scripts\activate && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo 2. Frontend: cd Frontend && npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs
echo.
pause