import requests
import json

def debug_api_call():
    """Debug API call to see which prompt is being used"""
    url = "http://localhost:5000/api/ai/chat"
    data = {
        "message": "Give me a 2 day itinerary for Sandakan",
        "user_id": "debug_test"
    }
    
    print("Making API call...")
    response = requests.post(url, json=data)
    result = response.json()
    
    print("=== DEBUG API RESPONSE ===")
    print(f"Status Code: {response.status_code}")
    print(f"Success: {result.get('success')}")
    print(f"Response Type: {result.get('response_type')}")
    print(f"Response Length: {len(result.get('response', ''))} characters")
    print("\n=== FULL RESPONSE ===")
    print(result.get('response'))
    
    # Check for specific elements
    response_text = result.get('response', '')
    
    print("\n=== ANALYSIS ===")
    print(f"Contains box characters: {'┌' in response_text or '│' in response_text or '└' in response_text}")
    print(f"Contains booking.com: {'booking.com' in response_text}")
    print(f"Contains skyscanner: {'skyscanner.com' in response_text}")
    print(f"Contains klook: {'klook.com' in response_text}")
    print(f"Contains 'Quick Access Links': {'Quick Access Links' in response_text}")
    print(f"Contains 'Useful Links': {'Useful Links' in response_text}")

if __name__ == "__main__":
    debug_api_call()