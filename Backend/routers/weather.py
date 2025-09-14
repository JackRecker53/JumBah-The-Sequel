from fastapi import APIRouter, HTTPException
import httpx
import os

router = APIRouter()

@router.get("/test")
async def test_weather():
    """Test endpoint to verify weather router is working"""
    return {"message": "Weather router is working", "api_key_exists": bool(os.getenv("WEATHER_API_KEY"))}

@router.get("")
async def get_weather(lat: float, lon: float):
    """Get current weather data for given coordinates"""
    api_key = os.getenv("WEATHER_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="Weather API key not configured")
    
    try:
        # WeatherAPI.com endpoint
        url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={lat},{lon}&aqi=no"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Extract relevant weather information
            weather_data = {
                "location": {
                    "name": data["location"]["name"],
                    "region": data["location"]["region"],
                    "country": data["location"]["country"],
                    "lat": data["location"]["lat"],
                    "lon": data["location"]["lon"]
                },
                "current": {
                    "temp_c": data["current"]["temp_c"],
                    "temp_f": data["current"]["temp_f"],
                    "condition": {
                        "text": data["current"]["condition"]["text"],
                        "icon": data["current"]["condition"]["icon"]
                    },
                    "humidity": data["current"]["humidity"],
                    "wind_kph": data["current"]["wind_kph"],
                    "wind_dir": data["current"]["wind_dir"],
                    "pressure_mb": data["current"]["pressure_mb"],
                    "feelslike_c": data["current"]["feelslike_c"],
                    "feelslike_f": data["current"]["feelslike_f"],
                    "uv": data["current"]["uv"]
                }
            }
            
            return weather_data
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Weather API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/location")
async def get_weather_by_location(q: str):
    """Get current weather data by location name (city, region, etc.)"""
    api_key = os.getenv("WEATHER_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="Weather API key not configured")
    
    try:
        # WeatherAPI.com endpoint
        url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={q}&aqi=no"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Extract relevant weather information
            weather_data = {
                "location": {
                    "name": data["location"]["name"],
                    "region": data["location"]["region"],
                    "country": data["location"]["country"],
                    "lat": data["location"]["lat"],
                    "lon": data["location"]["lon"]
                },
                "current": {
                    "temp_c": data["current"]["temp_c"],
                    "temp_f": data["current"]["temp_f"],
                    "condition": data["current"]["condition"]["text"],
                    "icon": data["current"]["condition"]["icon"],
                    "humidity": data["current"]["humidity"],
                    "wind_kph": data["current"]["wind_kph"],
                    "wind_dir": data["current"]["wind_dir"],
                    "pressure_mb": data["current"]["pressure_mb"],
                    "feels_like_c": data["current"]["feelslike_c"],
                    "feels_like_f": data["current"]["feelslike_f"],
                    "uv": data["current"]["uv"]
                }
            }
            
            return weather_data
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Weather API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")