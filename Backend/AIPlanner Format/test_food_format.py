import requests
import json

def test_food_formatting():
    """
    Test the new food formatting functionality
    """
    # Test food queries
    food_queries = [
        "Where can I find good roast pork in Kota Kinabalu?",
        "Best restaurants in Sandakan",
        "What local food should I try in Sabah?",
        "Recommend some seafood restaurants in Semporna",
        "Where to eat hinava?",
        "Good coffee shops in Tawau",
        "Halal restaurants near me",
        "Traditional Sabah cuisine"
    ]
    
    print("Testing Food Formatting...\n")
    
    for query in food_queries:
        print(f"Testing query: '{query}'")
        
        # Send POST request to the API
        response = requests.post(
            "http://localhost:5000/api/ai/chat",
            json={
                "message": query,
                "user_id": "test_food_format"
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print(f"Response Type: {result.get('response_type', 'unknown')}")
                print(f"Response Length: {len(result.get('response', ''))} characters")
                
                response_content = result.get('response', '')
                
                # Check for food formatting elements
                food_indicators = {
                    'Food emoji': '🍽️' in response_content,
                    'Restaurant sections': '🏆' in response_content,
                    'Location details': '📍' in response_content,
                    'Hours information': '🕒' in response_content,
                    'Price range': '💰' in response_content,
                    'Specialty dishes': '⭐' in response_content,
                    'Contact info': '📱' in response_content,
                    'Google Maps links': 'Google Maps' in response_content,
                    'Food culture section': '🍲' in response_content,
                    'Useful links box': '┌─────────────────────────────────────────────────────────────┐' in response_content,
                    'Structured format': '###' in response_content
                }
                
                print("Food Format Analysis:")
                for indicator, found in food_indicators.items():
                    status = "✅" if found else "❌"
                    print(f"  {status} {indicator}")
                
                print(f"\nFirst 300 characters of response:")
                print(f"{response_content[:300]}...\n")
                print("-" * 80)
            else:
                print(f"❌ API Error: {result.get('error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
        
        print()

if __name__ == "__main__":
    test_food_formatting()