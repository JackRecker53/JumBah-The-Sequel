from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="JumBah Backend API",
    description="Backend API for JumBah travel application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {
        "message": "JumBah Backend API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Import and include routers
from routers import locations, ai_planner, weather, users, ai_content

app.include_router(locations.router, prefix="/api/locations", tags=["locations"])
app.include_router(ai_planner.router, prefix="/api/ai-planner", tags=["ai-planner"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(ai_content.router, prefix="/api/ai-content", tags=["ai-content"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)