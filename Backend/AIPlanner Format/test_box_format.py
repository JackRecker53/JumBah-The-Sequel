import requests
import json

def test_box_format():
    """Test itinerary with box format"""
    url = "http://localhost:5000/api/ai/chat"
    data = {
        "message": "Give me a 2 day itinerary for Sandakan",
        "user_id": "test_box_format"
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    print("=== BOX FORMAT TEST ===")
    print(f"Success: {result.get('success')}")
    print(f"Response Type: {result.get('response_type')}")
    print("Response:")
    print(result.get('response'))
    
    # Check if box format is present
    response_text = result.get('response', '')
    if '┌─────────────────────────────────────────────────────────────┐' in response_text:
        print("\n✅ Box format detected!")
    else:
        print("\n❌ Box format not found.")
    
    # Check for website links
    links = ['booking.com', 'skyscanner.com', 'klook.com', 'rentalcars.com', 'weather.com']
    found_links = []
    for link in links:
        if link in response_text:
            found_links.append(link)
    
    if found_links:
        print(f"✅ Found website links: {', '.join(found_links)}")
    else:
        print("❌ No website links found.")

if __name__ == "__main__":
    test_box_format()