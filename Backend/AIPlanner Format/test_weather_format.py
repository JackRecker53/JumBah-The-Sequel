import asyncio
import requests
import json

def test_weather_formatting():
    """
    Test the new weather formatting functionality
    """
    # Test weather queries
    weather_queries = [
        "What's the weather like in Kota Kinabalu today?",
        "Weather forecast for Sandakan tomorrow",
        "Is it going to rain in Semporna?",
        "Temperature in Sabah today",
        "How's the weather?"
    ]
    
    print("Testing Weather Formatting...\n")
    
    for query in weather_queries:
        print(f"Testing query: '{query}'")
        
        # Send POST request to the API
        response = requests.post(
            "http://localhost:5000/api/ai/chat",
            json={
                "message": query,
                "user_id": "test_weather_format"
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print(f"Response Type: {result.get('response_type', 'unknown')}")
                print(f"Response Length: {len(result.get('response', ''))} characters")
                
                response_content = result.get('response', '')
                
                # Check for weather formatting elements
                weather_indicators = {
                    'Weather emoji': '🌤️' in response_content,
                    'Temperature section': '🌡️' in response_content,
                    'Conditions section': '☁️' in response_content,
                    'Precipitation section': '🌧️' in response_content,
                    'Travel recommendations': '🎒' in response_content,
                    'Weather links box': '┌─────────────────────────────────────────────────────────────┐' in response_content,
                    'Structured format': '###' in response_content
                }
                
                print("Weather Format Analysis:")
                for indicator, found in weather_indicators.items():
                    status = "✅" if found else "❌"
                    print(f"  {status} {indicator}")
                
                print(f"\nFirst 200 characters of response:")
                print(f"{response_content[:200]}...\n")
                print("-" * 80)
            else:
                print(f"❌ API Error: {result.get('error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
        
        print()

if __name__ == "__main__":
    test_weather_formatting()