import re
from typing import Dict, List, Any

class ResponseFormatter:
    """
    Utility class to format AI responses into structured, readable formats
    with proper point formatting and box layouts.
    """
    
    @staticmethod
    def format_response(response: str, response_type: str = "general") -> str:
        """
        Format AI response based on the type of query
        
        Args:
            response: Raw AI response text
            response_type: Type of response (itinerary, food, directions, etc.)
        
        Returns:
            Formatted response string
        """
        if response_type == "itinerary":
            return ResponseFormatter._format_itinerary(response)
        elif response_type == "food":
            return ResponseFormatter._format_food_recommendations(response)
        elif response_type == "directions":
            return ResponseFormatter._format_directions(response)
        elif response_type == "attractions":
            return ResponseFormatter._format_attractions(response)
        else:
            return ResponseFormatter._format_general(response)
    
    @staticmethod
    def _format_itinerary(response: str) -> str:
        """Format itinerary responses with structured layout"""
        # If response is too short or malformed, return a structured template
        if len(response.strip()) < 100 or "day" not in response.lower():
            return ResponseFormatter._create_sample_itinerary()
        
        formatted = "## 🗺️ **Your Sabah Adventure Itinerary**\n\n"
        
        # Add budget info if present
        budget_match = re.search(r'RM\s*[\d,]+', response)
        if budget_match:
            formatted += f"### 💰 **Budget: {budget_match.group()}**\n\n"
        
        # Extract days from response
        days = ResponseFormatter._extract_days(response)
        
        if not days:
            # If no days found, create a sample itinerary
            return ResponseFormatter._create_sample_itinerary()
        
        # Format each day
        for i, day_content in enumerate(days, 1):
            formatted += f"### 📅 **Day {i}**\n\n"
            
            # Extract activities for this day
            activities = ResponseFormatter._extract_day_activities(day_content)
            
            if activities:
                for activity in activities:
                    formatted += f"**{activity['time']}**\n"
                    formatted += f"• {activity['description']}\n\n"
            else:
                # Add default activities if none found
                formatted += "**Morning (9:00 AM - 12:00 PM)**\n"
                formatted += "• Explore local attractions and cultural sites\n\n"
                formatted += "**Afternoon (1:00 PM - 5:00 PM)**\n"
                formatted += "• Enjoy local cuisine and shopping\n\n"
                formatted += "**Evening (6:00 PM - 9:00 PM)**\n"
                formatted += "• Sunset viewing and dinner\n\n"
        
        # Add tips section
        tips = ResponseFormatter._extract_tips(response)
        if tips:
            formatted += "### 💡 **Pro Tips**\n\n"
            for tip in tips:
                formatted += f"• {tip}\n"
        else:
            formatted += "### 💡 **Pro Tips**\n\n"
            formatted += "• Book accommodations in advance\n"
            formatted += "• Bring comfortable walking shoes\n"
            formatted += "• Try local Sabahan cuisine\n"
            formatted += "• Check weather forecast before outdoor activities\n"
        
        return formatted
    
    @staticmethod
    def _create_sample_itinerary() -> str:
        """Create a sample itinerary when response is incomplete"""
        return """
## 🗺️ **Your Sabah Adventure Itinerary**

### 💰 **Budget: RM5000**

### 📅 **Day 1: Arrival & City Exploration**
**Morning (9:00 AM - 12:00 PM)**
• Arrive at Kota Kinabalu International Airport
• Check into hotel in city center
• Visit Sabah State Museum

**Afternoon (1:00 PM - 5:00 PM)**
• Explore Gaya Street Sunday Market
• Visit Atkinson Clock Tower
• Lunch at local restaurant

**Evening (6:00 PM - 9:00 PM)**
• Sunset at Tanjung Aru Beach
• Dinner at KK Waterfront
• Night market shopping

### 📅 **Day 2: Nature & Adventure**
**Morning (6:00 AM - 12:00 PM)**
• Early start to Kinabalu Park
• Nature walk and bird watching
• Visit Poring Hot Springs

**Afternoon (1:00 PM - 5:00 PM)**
• Canopy walk at Poring
• Visit Kundasang War Memorial
• Local lunch in Kundasang

**Evening (6:00 PM - 9:00 PM)**
• Return to Kota Kinabalu
• Dinner at seafood restaurant
• Relax at hotel

### 📅 **Day 3: Island & Culture**
**Morning (8:00 AM - 12:00 PM)**
• Boat trip to Manukan Island
• Snorkeling and beach activities
• Island lunch

**Afternoon (1:00 PM - 5:00 PM)**
• Return to mainland
• Visit Mari-Mari Cultural Village
• Traditional cultural experience

**Evening (6:00 PM - 9:00 PM)**
• Final dinner in city
• Shopping for souvenirs
• Departure preparation

### 💡 **Pro Tips**
• Book accommodations in advance
• Bring comfortable walking shoes
• Try local Sabahan cuisine
• Check weather forecast before outdoor activities
• Bring sunscreen and insect repellent
• Learn basic Malay phrases
        """.strip()
    
    @staticmethod
    def _extract_days(response: str) -> List[str]:
        """Extract day sections from response"""
        # Look for day patterns
        day_patterns = [
            r'Day\s+\d+[:\-]?\s*(.*?)(?=Day\s+\d+|$)',
            r'Day\s+\d+[:\-]?\s*(.*?)(?=\n\n|$)',
            r'###\s*Day\s+\d+.*?\n(.*?)(?=###|$)'
        ]
        
        days = []
        for pattern in day_patterns:
            matches = re.findall(pattern, response, re.IGNORECASE | re.DOTALL)
            if matches:
                days.extend([match.strip() for match in matches if match.strip()])
                break
        
        return days
    
    @staticmethod
    def _extract_day_activities(day_content: str) -> List[Dict[str, str]]:
        """Extract activities from a day's content"""
        activities = []
        
        # Look for time patterns
        time_patterns = [
            r'(Morning|Afternoon|Evening|Night)\s*[:\-]?\s*(.*?)(?=Morning|Afternoon|Evening|Night|$)',
            r'(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\s*[:\-]?\s*(.*?)(?=\d{1,2}:\d{2}|$)',
            r'(\d{1,2}\s*(?:AM|PM|am|pm))\s*[:\-]?\s*(.*?)(?=\d{1,2}\s*(?:AM|PM|am|pm)|$)'
        ]
        
        for pattern in time_patterns:
            matches = re.findall(pattern, day_content, re.IGNORECASE | re.DOTALL)
            for match in matches:
                if len(match) >= 2:
                    activities.append({
                        'time': match[0].strip(),
                        'description': match[1].strip()
                    })
        
        return activities
    
    @staticmethod
    def _format_food_recommendations(response: str) -> str:
        """Format food recommendation responses"""
        # If response is too short or empty, return a sample
        if len(response.strip()) < 50:
            return ResponseFormatter._create_sample_food_recommendations()
        
        formatted = "## 🍽️ **Food Recommendations**\n\n"
        
        # Extract restaurant recommendations
        restaurants = ResponseFormatter._extract_restaurants(response)
        
        if not restaurants:
            return ResponseFormatter._create_sample_food_recommendations()
        
        for i, restaurant in enumerate(restaurants, 1):
            formatted += f"### 🏆 **{i}. {restaurant['name']}**\n\n"
            formatted += f"📍 **Location:** {restaurant['location']}\n\n"
            formatted += f"🍽️ **Must Try:** {restaurant['specialty']}\n\n"
            formatted += f"💰 **Price Range:** {restaurant['price']}\n\n"
            formatted += f"⭐ **Rating:** {restaurant['rating']}\n\n"
            if restaurant.get('hours'):
                formatted += f"🕒 **Hours:** {restaurant['hours']}\n\n"
            formatted += "---\n\n"
        
        return formatted
    
    @staticmethod
    def _create_sample_food_recommendations() -> str:
        """Create sample food recommendations when response is empty"""
        return """
## 🍽️ **Food Recommendations in Kota Kinabalu**

### 🏆 **Top Local Eateries**

#### 1. **Kedai Kopi Yee Fung** ⭐ 4.5/5
📍 **Location:** 127, Jalan Gaya, 88000 Kota Kinabalu
🍽️ **Must Try:** Mee Sup Daging, Mee Sup Ayam
💰 **Price Range:** RM8-12
🕒 **Hours:** 6:00 AM - 2:00 PM (Daily)
✅ **Halal:** Yes (JAKIM Certified)

#### 2. **Restoran Nasi Kandar Pelita** ⭐ 4.3/5
📍 **Location:** Jalan Lintas, 88300 Kota Kinabalu
🍽️ **Must Try:** Nasi Kandar, Mee Sup Kambing, Roti Canai
💰 **Price Range:** RM6-10
🕒 **Hours:** 24 Hours (Daily)
✅ **Halal:** Yes (JAKIM Certified)

#### 3. **Welcome Seafood Restaurant** ⭐ 4.6/5
📍 **Location:** Jalan Lintas, 88300 Kota Kinabalu
🍽️ **Must Try:** Butter Prawns, Chili Crab, Steamed Fish
💰 **Price Range:** RM50-80 per person
🕒 **Hours:** 11:00 AM - 10:00 PM (Daily)
✅ **Halal:** Yes (JAKIM Certified)

### 💡 **Pro Tips**
• **Check halal status** if important to you
• **Ask about ingredients** if you have allergies
• **Bring cash** - many places don't accept cards
• **Try local specialties** for authentic experience
• **Visit during off-peak hours** to avoid crowds
        """.strip()
    
    @staticmethod
    def _format_directions(response: str) -> str:
        """Format direction responses"""
        formatted = "## 🗺️ **Directions**\n\n"
        
        # Extract step-by-step directions
        steps = ResponseFormatter._extract_directions_steps(response)
        
        for i, step in enumerate(steps, 1):
            formatted += f"**Step {i}:** {step}\n\n"
        
        # Add map link if present
        if "google" in response.lower() or "maps" in response.lower():
            formatted += "### 📱 **Quick Navigation**\n\n"
            formatted += "• [Open in Google Maps](https://maps.google.com)\n"
            formatted += "• [Get Waze Directions](https://waze.com)\n\n"
        
        return formatted
    
    @staticmethod
    def _format_attractions(response: str) -> str:
        """Format attraction recommendations"""
        formatted = "## 🏛️ **Attractions & Activities**\n\n"
        
        # Extract attractions
        attractions = ResponseFormatter._extract_attractions(response)
        
        for attraction in attractions:
            formatted += f"### 🎯 **{attraction['name']}**\n\n"
            formatted += f"📍 **Location:** {attraction['location']}\n\n"
            formatted += f"📝 **Description:** {attraction['description']}\n\n"
            if attraction.get('best_time'):
                formatted += f"⏰ **Best Time:** {attraction['best_time']}\n\n"
            if attraction.get('price'):
                formatted += f"💰 **Entry Fee:** {attraction['price']}\n\n"
            formatted += "---\n\n"
        
        return formatted
    
    @staticmethod
    def _format_general(response: str) -> str:
        """Format general responses with basic structure"""
        # Split into paragraphs
        paragraphs = [p.strip() for p in response.split('\n') if p.strip()]
        
        formatted = "## 💬 **MaduAI Response**\n\n"
        
        for paragraph in paragraphs:
            # Check if it's a list item
            if paragraph.startswith(('•', '-', '*', '1.', '2.', '3.')):
                formatted += f"• {paragraph.lstrip('•-*123456789. ')}\n"
            else:
                formatted += f"{paragraph}\n\n"
        
        return formatted
    
    @staticmethod
    def _extract_sections(text: str) -> List[str]:
        """Extract main sections from text"""
        # Split by common section markers
        sections = re.split(r'\n\s*(?=Day|Morning|Afternoon|Evening|###|##)', text, flags=re.IGNORECASE)
        return [s.strip() for s in sections if s.strip()]
    
    @staticmethod
    def _extract_activities(text: str) -> List[Dict[str, str]]:
        """Extract time-based activities from text"""
        activities = []
        
        # Look for time patterns
        time_patterns = [
            r'(Morning|Afternoon|Evening|Night)\s*[:\-]?\s*(.+)',
            r'(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\s*[:\-]?\s*(.+)',
            r'(\d{1,2}\s*(?:AM|PM|am|pm))\s*[:\-]?\s*(.+)'
        ]
        
        for pattern in time_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                activities.append({
                    'time': match[0],
                    'description': match[1].strip()
                })
        
        return activities
    
    @staticmethod
    def _extract_restaurants(text: str) -> List[Dict[str, str]]:
        """Extract restaurant information from text"""
        restaurants = []
        
        # Simple extraction - in a real implementation, this would be more sophisticated
        lines = text.split('\n')
        current_restaurant = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_restaurant:
                    restaurants.append(current_restaurant)
                    current_restaurant = {}
                continue
            
            # Look for restaurant names (usually in quotes or after numbers)
            if re.match(r'^\d+\.\s*["\']?([^"\']+)["\']?', line):
                if current_restaurant:
                    restaurants.append(current_restaurant)
                current_restaurant = {'name': re.sub(r'^\d+\.\s*["\']?([^"\']+)["\']?', r'\1', line)}
            elif 'location' in line.lower() and current_restaurant:
                current_restaurant['location'] = line
            elif 'specialty' in line.lower() or 'must try' in line.lower() and current_restaurant:
                current_restaurant['specialty'] = line
            elif 'price' in line.lower() and current_restaurant:
                current_restaurant['price'] = line
            elif 'rating' in line.lower() and current_restaurant:
                current_restaurant['rating'] = line
            elif 'hours' in line.lower() and current_restaurant:
                current_restaurant['hours'] = line
        
        if current_restaurant:
            restaurants.append(current_restaurant)
        
        return restaurants
    
    @staticmethod
    def _extract_directions_steps(text: str) -> List[str]:
        """Extract step-by-step directions"""
        steps = []
        
        # Look for numbered steps
        step_pattern = r'(\d+\.?\s*.+)'
        matches = re.findall(step_pattern, text)
        
        for match in matches:
            step = re.sub(r'^\d+\.?\s*', '', match).strip()
            if step:
                steps.append(step)
        
        return steps
    
    @staticmethod
    def _extract_attractions(text: str) -> List[Dict[str, str]]:
        """Extract attraction information"""
        attractions = []
        
        # Simple extraction
        lines = text.split('\n')
        current_attraction = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_attraction:
                    attractions.append(current_attraction)
                    current_attraction = {}
                continue
            
            # Look for attraction names
            if re.match(r'^\d+\.\s*(.+)', line):
                if current_attraction:
                    attractions.append(current_attraction)
                current_attraction = {'name': re.sub(r'^\d+\.\s*', '', line)}
            elif 'location' in line.lower() and current_attraction:
                current_attraction['location'] = line
            elif 'description' in line.lower() and current_attraction:
                current_attraction['description'] = line
            elif 'time' in line.lower() and current_attraction:
                current_attraction['best_time'] = line
            elif 'price' in line.lower() and current_attraction:
                current_attraction['price'] = line
        
        if current_attraction:
            attractions.append(current_attraction)
        
        return attractions
    
    @staticmethod
    def _extract_tips(text: str) -> List[str]:
        """Extract tips from text"""
        tips = []
        
        # Look for tip patterns
        tip_patterns = [
            r'Tip\s*\d*[:\-]?\s*(.+)',
            r'Pro\s+tip[:\-]?\s*(.+)',
            r'Note[:\-]?\s*(.+)',
            r'Remember[:\-]?\s*(.+)'
        ]
        
        for pattern in tip_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                tip = match.strip()
                if tip and len(tip) > 10:  # Filter out very short tips
                    tips.append(tip)
        
        return tips

# Example usage
if __name__ == "__main__":
    formatter = ResponseFormatter()
    
    # Test with sample responses
    sample_itinerary = """
    Day 1: Arrival and City Tour
    Morning: Check into hotel, visit Sabah Museum
    Afternoon: Explore Gaya Street, try local food
    Evening: Sunset at Signal Hill
    
    Day 2: Nature Adventure
    Morning: Early start to Kinabalu Park
    Afternoon: Hiking and nature walk
    Evening: Return to hotel, dinner at local restaurant
    
    Budget: RM5000 for 3 days
    """
    
    formatted = formatter.format_response(sample_itinerary, "itinerary")
    print(formatted)
