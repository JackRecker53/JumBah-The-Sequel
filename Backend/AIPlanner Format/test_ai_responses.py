import requests
import json

def test_casual_greeting():
    """Test casual greeting response"""
    url = "http://localhost:5000/api/ai/chat"
    data = {
        "message": "hello",
        "user_id": "test_user_casual"
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    print("=== CASUAL GREETING TEST ===")
    print(f"Success: {result.get('success')}")
    print(f"Response Type: {result.get('response_type')}")
    print(f"Response: {result.get('response')}")
    print(f"Response Length: {len(result.get('response', ''))} characters")
    print()

def test_itinerary_request():
    """Test itinerary request response"""
    url = "http://localhost:5000/api/ai/chat"
    data = {
        "message": "I want a 3 day itinerary for Kota Kinabalu",
        "user_id": "test_user_itinerary"
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    print("=== ITINERARY REQUEST TEST ===")
    print(f"Success: {result.get('success')}")
    print(f"Response Type: {result.get('response_type')}")
    print(f"Response: {result.get('response')}")
    print(f"Response Length: {len(result.get('response', ''))} characters")
    print()

def test_simple_question():
    """Test simple question response"""
    url = "http://localhost:5000/api/ai/chat"
    data = {
        "message": "What's the weather like?",
        "user_id": "test_user_question"
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    print("=== SIMPLE QUESTION TEST ===")
    print(f"Success: {result.get('success')}")
    print(f"Response Type: {result.get('response_type')}")
    print(f"Response: {result.get('response')}")
    print(f"Response Length: {len(result.get('response', ''))} characters")
    print()

if __name__ == "__main__":
    test_casual_greeting()
    test_simple_question()
    test_itinerary_request()