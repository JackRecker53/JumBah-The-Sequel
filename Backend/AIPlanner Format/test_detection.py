import sys
sys.path.append('.')
from services.ai_planner import AIPlanner

def test_detection():
    ai_planner = AIPlanner()
    
    test_messages = [
        "hello",
        "Give me a 2 day itinerary for Sandakan",
        "I want a 3 day itinerary for Kota Kinabalu",
        "What's the weather like?",
        "Plan my trip to Sabah",
        "Things to do in Semporna"
    ]
    
    for message in test_messages:
        is_itinerary = ai_planner._is_itinerary_request(message)
        print(f"Message: '{message}'")
        print(f"Is itinerary request: {is_itinerary}")
        print("---")

if __name__ == "__main__":
    test_detection()