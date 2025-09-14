import asyncio
import json
import requests
from pathlib import Path

async def test_history_integration():
    """
    Test that chat history properly saves and loads different response types
    """
    base_url = "http://localhost:5000"
    test_user_id = "test_history_user"
    
    # Test queries for different response types
    test_queries = [
        {"message": "Plan a 3-day trip to Kota Kinabalu", "expected_type": "itinerary"},
        {"message": "What's the weather like in Sabah?", "expected_type": "weather"},
        {"message": "Recommend some traditional Sabah food", "expected_type": "food"},
        {"message": "Hello, how are you?", "expected_type": "casual"}
    ]
    
    print("Testing chat history integration with different response types...\n")
    
    # Clear any existing history for test user
    history_file = Path(f"chat_history/{test_user_id}_history.json")
    if history_file.exists():
        history_file.unlink()
    
    # Send test queries and check responses
    for i, query in enumerate(test_queries, 1):
        print(f"Test {i}: {query['message']}")
        
        # Send chat request
        response = requests.post(
            f"{base_url}/api/ai/chat",
            json={
                "user_id": test_user_id,
                "message": query["message"]
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            actual_type = data.get("response_type", "unknown")
            print(f"  ✓ Response type: {actual_type}")
            
            if actual_type == query["expected_type"]:
                print(f"  ✓ Correct response type detected")
            else:
                print(f"  ✗ Expected {query['expected_type']}, got {actual_type}")
        else:
            print(f"  ✗ Request failed: {response.status_code}")
        
        print()
    
    # Check chat history
    print("Checking saved chat history...")
    
    if history_file.exists():
        with open(history_file, 'r', encoding='utf-8') as f:
            history = json.load(f)
        
        print(f"Found {len(history)} entries in history")
        
        for i, entry in enumerate(history, 1):
            message_type = entry.get("type", "unknown")
            user_msg = entry.get("user_message", "")[:50] + "..."
            print(f"  Entry {i}: Type '{message_type}' - {user_msg}")
            
            # Check if response contains expected formatting
            ai_response = entry.get("ai_response", "")
            
            if message_type == "food":
                has_emoji = "🍽️" in ai_response or "🥘" in ai_response
                has_location = "Location:" in ai_response or "Address:" in ai_response
                print(f"    Food formatting - Emoji: {has_emoji}, Location: {has_location}")
            
            elif message_type == "weather":
                has_weather_emoji = "🌤️" in ai_response or "☀️" in ai_response or "🌧️" in ai_response
                has_temp = "°C" in ai_response or "temperature" in ai_response.lower()
                print(f"    Weather formatting - Emoji: {has_weather_emoji}, Temperature: {has_temp}")
            
            elif message_type == "itinerary":
                has_day_structure = "Day 1" in ai_response or "Day 2" in ai_response
                has_accommodation = "accommodation" in ai_response.lower() or "hotel" in ai_response.lower()
                print(f"    Itinerary formatting - Day structure: {has_day_structure}, Accommodation: {has_accommodation}")
    
    else:
        print("  ✗ No history file found")
    
    # Test history retrieval endpoint
    print("\nTesting history retrieval endpoint...")
    history_response = requests.get(f"{base_url}/api/ai/history/{test_user_id}")
    
    if history_response.status_code == 200:
        history_data = history_response.json()
        if history_data.get("success"):
            retrieved_history = history_data.get("history", [])
            print(f"  ✓ Retrieved {len(retrieved_history)} entries via API")
            
            # Verify types are preserved
            types_found = set(entry.get("type") for entry in retrieved_history)
            print(f"  ✓ Response types in history: {types_found}")
        else:
            print(f"  ✗ History retrieval failed: {history_data.get('error')}")
    else:
        print(f"  ✗ History endpoint failed: {history_response.status_code}")

if __name__ == "__main__":
    asyncio.run(test_history_integration())