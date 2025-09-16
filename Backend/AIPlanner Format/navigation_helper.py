import re
from typing import Dict, List, Any, Optional
from datetime import datetime

class NavigationHelper:
    """
    Specialized helper for navigation and directions in Sabah, Malaysia
    Provides detailed, context-rich directions with local landmarks and tips
    """
    
    # Sabah-specific landmarks and reference points
    SABAH_LANDMARKS = {
        'kota_kinabalu': {
            'center': 'Suria Sabah Mall',
            'landmarks': [
                'Suria Sabah Mall', 'Imago Shopping Mall', '1Borneo Hypermall',
                'Gaya Street', 'Filipino Market', 'Central Market',
                'Kota Kinabalu City Mosque', 'Signal Hill', 'Atkinson Clock Tower',
                'Sabah State Museum', 'Tanjung Aru Beach', 'KK Waterfront'
            ]
        },
        'airport': {
            'name': 'Kota Kinabalu International Airport (BKI)',
            'code': 'BKI',
            'location': 'Sepanggar Bay'
        },
        'major_roads': [
            'Jalan Lintas', 'Jalan Tuaran', 'Jalan Penampang', 'Jalan Putatan',
            'Jalan Kolam', 'Jalan Sulaman', 'Jalan Sepanggar', 'Jalan Sembulan'
        ]
    }
    
    # Common destinations with detailed directions
    DESTINATIONS = {
        'imago_shopping_mall': {
            'name': 'Imago Shopping Mall',
            'address': 'Jalan Tun Fuad Stephens, 88000 Kota Kinabalu, Sabah',
            'landmarks': ['Near KK Times Square', 'Opposite Sutera Harbour'],
            'parking': 'Multi-level parking available',
            'public_transport': 'City Bus routes 1, 2, 3, 5A',
            'grab_estimate': 'RM8-15 from city center'
        },
        'tanjung_aru_beach': {
            'name': 'Tanjung Aru Beach',
            'address': 'Jalan Mat Salleh, 88100 Kota Kinabalu, Sabah',
            'landmarks': ['Near Tanjung Aru Market', 'Close to KK Airport'],
            'best_time': '5:30 PM - 7:00 PM for sunset',
            'parking': 'Free parking available',
            'public_transport': 'City Bus route 13A, 13B'
        },
        'gaya_street': {
            'name': 'Gaya Street Sunday Market',
            'address': 'Gaya Street, 88000 Kota Kinabalu, Sabah',
            'landmarks': ['Near Atkinson Clock Tower', 'Opposite Central Market'],
            'operating_hours': 'Sunday 6:00 AM - 1:00 PM',
            'parking': 'Limited street parking, use nearby car parks'
        },
        'kinabalu_park': {
            'name': 'Kinabalu Park',
            'address': 'Ranau, 89300 Sabah',
            'distance_from_kk': '88km (1.5-2 hours drive)',
            'landmarks': ['Near Kundasang', 'Mount Kinabalu base'],
            'best_time': 'Early morning (6:00 AM - 8:00 AM)',
            'parking': 'Free parking at park entrance'
        }
    }
    
    @staticmethod
    def get_directions_to_imago() -> str:
        """Get detailed directions to Imago Shopping Mall"""
        return f"""
## 🗺️ **Directions to Imago Shopping Mall**

### 📍 **Location Details**
**Address:** {NavigationHelper.DESTINATIONS['imago_shopping_mall']['address']}
**Landmarks:** {', '.join(NavigationHelper.DESTINATIONS['imago_shopping_mall']['landmarks'])}

### 🚗 **By Car (From City Center)**
**Route 1 - Via Jalan Lintas (Recommended - 15-20 minutes)**
1. **Start:** From Suria Sabah Mall or Gaya Street
2. **Head North:** Take Jalan Lintas towards Tuaran
3. **Continue:** Drive straight for about 8km
4. **Turn Right:** At the traffic light intersection with Jalan Tun Fuad Stephens
5. **Arrive:** Imago Shopping Mall will be on your right

**Route 2 - Via Coastal Road (Scenic - 25-30 minutes)**
1. **Start:** From KK Waterfront
2. **Head West:** Take Jalan Mat Salleh towards Tanjung Aru
3. **Continue:** Follow the coastal road past Tanjung Aru Beach
4. **Turn Left:** At the roundabout towards Sutera Harbour
5. **Arrive:** Imago Shopping Mall will be on your left

### 🚌 **By Public Transport**
• **City Bus:** Routes 1, 2, 3, 5A (RM1-2)
• **Grab/Taxi:** RM8-15 from city center
• **Walking:** Not recommended due to distance

### 🅿️ **Parking Information**
• **Multi-level parking** available
• **Free parking** for first 2 hours
• **RM2/hour** after 2 hours
• **Peak hours:** 6:00 PM - 9:00 PM (may be full)

### 💡 **Pro Tips**
• **Best time to visit:** Weekday mornings (10:00 AM - 12:00 PM)
• **Avoid:** Weekends and public holidays (very crowded)
• **Nearby attractions:** Sutera Harbour Marina, KK Times Square
• **Food options:** Food court on Level 3, restaurants on Level 1

### 📱 **Quick Navigation Links**
• [Google Maps](https://maps.google.com/search/Imago+Shopping+Mall+Kota+Kinabalu)
• [Waze](https://waze.com/ul?q=Imago+Shopping+Mall+Kota+Kinabalu)
• [Grab](https://grab.com/my/transport/)
        """.strip()
    
    @staticmethod
    def get_sunset_locations() -> str:
        """Get detailed information about sunset viewing locations in KK"""
        return f"""
## 🌅 **Best Sunset Spots in Kota Kinabalu**

### 🏆 **Top Recommendations**

#### 1. **Tanjung Aru Beach** ⭐⭐⭐⭐⭐
**📍 Location:** Jalan Mat Salleh, 88100 Kota Kinabalu
**🕒 Best Time:** 5:30 PM - 7:00 PM
**💰 Cost:** Free
**🚗 Distance:** 6km from city center (15-20 minutes)

**What to expect:**
• **Stunning sunset views** over the South China Sea
• **Local food stalls** selling fresh seafood and drinks
• **Beach activities** like volleyball and jogging
• **Photography opportunities** with Mount Kinabalu in background

**How to get there:**
• **By car:** Take Jalan Mat Salleh from city center
• **By bus:** City Bus route 13A, 13B (RM1)
• **By Grab:** RM8-12 from city center

#### 2. **KK Waterfront** ⭐⭐⭐⭐
**📍 Location:** Jalan Tun Fuad Stephens, 88000 Kota Kinabalu
**🕒 Best Time:** 6:00 PM - 7:30 PM
**💰 Cost:** Free
**🚗 Distance:** City center (5-10 minutes walk)

**What to expect:**
• **City skyline views** with sunset backdrop
• **Restaurants and cafes** for dinner and drinks
• **Evening entertainment** and live music
• **Shopping opportunities** at nearby malls

#### 3. **Signal Hill Observatory** ⭐⭐⭐⭐
**📍 Location:** Signal Hill, 88000 Kota Kinabalu
**🕒 Best Time:** 5:45 PM - 7:00 PM
**💰 Cost:** Free
**🚗 Distance:** 2km from city center (10-15 minutes)

**What to expect:**
• **Panoramic city views** from elevated position
• **Less crowded** than beach locations
• **Great for photography** with city and sea views
• **Cooler temperature** due to elevation

### 🍽️ **Dining Options Near Sunset Spots**

**Tanjung Aru Beach:**
• **Lok Kawi Seafood Restaurant** - Fresh local seafood
• **Tanjung Aru Market** - Local street food and drinks
• **Beachside cafes** - Coffee and light snacks

**KK Waterfront:**
• **Waterfront Restaurant** - International cuisine
• **Coffee Bean & Tea Leaf** - Coffee and desserts
• **Local food court** - Various Malaysian dishes

### 📸 **Photography Tips**
• **Golden hour:** Arrive 30 minutes before sunset
• **Bring tripod** for stable shots
• **Use wide-angle lens** for landscape shots
• **Check weather** - cloudy skies can create dramatic effects

### ⚠️ **Important Notes**
• **Weather dependent** - check forecast before going
• **Bring mosquito repellent** especially at Tanjung Aru
• **Dress comfortably** - casual beach attire recommended
• **Bring camera/phone** - you'll want to capture the moment!
        """.strip()
    
    @staticmethod
    def get_halal_mee_sup_locations() -> str:
        """Get detailed information about halal mee sup locations"""
        return f"""
## 🍜 **Best Halal Mee Sup in Kota Kinabalu**

### 🏆 **Top Halal Mee Sup Spots**

#### 1. **Kedai Kopi Yee Fung** ⭐⭐⭐⭐⭐
**📍 Location:** 127, Jalan Gaya, 88000 Kota Kinabalu
**🕒 Hours:** 6:00 AM - 2:00 PM (Daily)
**💰 Price:** RM8-12 per bowl
**🚗 Distance:** City center (5 minutes walk)

**Specialties:**
• **Original Mee Sup** - Traditional Sabahan style
• **Mee Sup Daging** - Beef-based soup
• **Mee Sup Ayam** - Chicken-based soup
• **Mee Sup Ikan** - Fish-based soup

**What makes it special:**
• **Family recipe** passed down for generations
• **Fresh ingredients** daily
• **Authentic Sabahan taste**
• **Friendly service** and clean environment

#### 2. **Restoran Nasi Kandar Pelita** ⭐⭐⭐⭐
**📍 Location:** Jalan Lintas, 88300 Kota Kinabalu
**🕒 Hours:** 24 hours (Daily)
**💰 Price:** RM6-10 per bowl
**🚗 Distance:** 3km from city center (10 minutes)

**Specialties:**
• **Mee Sup Kambing** - Mutton-based soup
• **Mee Sup Daging** - Beef-based soup
• **Mee Sup Ayam** - Chicken-based soup
• **Roti Canai** and other Indian-Muslim dishes

#### 3. **Kedai Makan Haji Ali** ⭐⭐⭐⭐
**📍 Location:** Jalan Gaya, 88000 Kota Kinabalu
**🕒 Hours:** 7:00 AM - 3:00 PM (Daily)
**💰 Price:** RM7-11 per bowl
**🚗 Distance:** City center (5 minutes walk)

**Specialties:**
• **Mee Sup Daging** - Signature beef soup
• **Mee Sup Ayam** - Chicken soup
• **Nasi Lemak** - Traditional Malaysian breakfast
• **Teh Tarik** - Pulled tea

### 🍽️ **What to Expect**
**Mee Sup** is a traditional Sabahan noodle soup with:
• **Rich, flavorful broth** (beef, chicken, or fish-based)
• **Fresh noodles** (usually yellow wheat noodles)
• **Tender meat** (beef, chicken, or fish)
• **Fresh vegetables** (bean sprouts, green onions)
• **Spices and herbs** (ginger, garlic, lemongrass)
• **Chili sauce** on the side

### 💡 **Pro Tips**
• **Best time to visit:** Early morning (7:00 AM - 9:00 AM)
• **Ask for extra chili** if you like spicy food
• **Try with roti canai** for a complete meal
• **Bring cash** - most places don't accept cards
• **Check halal certification** - all recommended places are halal

### 📍 **How to Get There**
**From City Center:**
• **Walking:** 5-10 minutes from Gaya Street
• **Grab/Taxi:** RM5-8
• **City Bus:** Routes 1, 2, 3 (RM1)

**Parking:**
• **Street parking** available (limited)
• **Central Market parking** nearby
• **Public transport recommended** due to limited parking
        """.strip()
    
    @staticmethod
    def get_seafood_restaurants() -> str:
        """Get detailed information about best seafood restaurants in KK"""
        return f"""
## 🦐 **Best Seafood Restaurants in Kota Kinabalu**

### 🏆 **Top Seafood Destinations**

#### 1. **Welcome Seafood Restaurant** ⭐⭐⭐⭐⭐
**📍 Location:** Jalan Lintas, 88300 Kota Kinabalu
**🕒 Hours:** 11:00 AM - 10:00 PM (Daily)
**💰 Price:** RM50-80 per person
**🚗 Distance:** 3km from city center (10 minutes)

**Specialties:**
• **Butter Prawns** - Signature dish with creamy butter sauce
• **Chili Crab** - Spicy and flavorful
• **Steamed Fish** - Fresh local fish with ginger and soy sauce
• **Sambal Squid** - Spicy squid with local sambal
• **Lobster** - Fresh lobster prepared various ways

**What makes it special:**
• **Fresh daily catch** from local fishermen
• **Expert preparation** by experienced chefs
• **Reasonable prices** for quality seafood
• **Friendly service** and clean environment

#### 2. **Kedai Kopi Yee Fung Seafood** ⭐⭐⭐⭐
**📍 Location:** Jalan Gaya, 88000 Kota Kinabalu
**🕒 Hours:** 6:00 AM - 2:00 PM (Daily)
**💰 Price:** RM30-50 per person
**🚗 Distance:** City center (5 minutes walk)

**Specialties:**
• **Mee Sup Ikan** - Fish noodle soup
• **Fried Fish** - Crispy fried local fish
• **Prawn Noodles** - Fresh prawns with noodles
• **Fish Head Curry** - Spicy curry with fish head

#### 3. **Tanjung Aru Seafood Market** ⭐⭐⭐⭐
**📍 Location:** Tanjung Aru Beach, 88100 Kota Kinabalu
**🕒 Hours:** 5:00 PM - 10:00 PM (Daily)
**💰 Price:** RM40-70 per person
**🚗 Distance:** 6km from city center (15-20 minutes)

**Specialties:**
• **Grilled Fish** - Fresh fish grilled to perfection
• **Prawns** - Various preparations
• **Crab** - Steamed or fried
• **Squid** - Grilled or fried
• **Local vegetables** - Fresh local greens

### 🍽️ **Seafood Specialties to Try**

**Must-Try Dishes:**
• **Butter Prawns** - Creamy, buttery prawns
• **Chili Crab** - Spicy crab with rich sauce
• **Steamed Fish** - Fresh fish with ginger and soy
• **Sambal Squid** - Spicy squid with local sambal
• **Fish Head Curry** - Spicy curry with fish head
• **Grilled Prawns** - Fresh prawns grilled with spices

**Local Favorites:**
• **Ikan Bakar** - Grilled fish with local spices
• **Udang Galah** - Large freshwater prawns
• **Ketam** - Fresh crab prepared various ways
• **Sotong** - Squid in various preparations

### 💡 **Pro Tips**
• **Best time to visit:** Evening (6:00 PM - 8:00 PM)
• **Ask for daily specials** - fresh catch of the day
• **Share dishes** - portions are usually large
• **Bring cash** - most places don't accept cards
• **Check freshness** - look for clear eyes and firm flesh

### 📍 **How to Get There**
**From City Center:**
• **Grab/Taxi:** RM8-15 depending on location
• **City Bus:** Various routes available
• **Walking:** Only for city center locations

**Parking:**
• **Restaurant parking** available
• **Street parking** (limited)
• **Public transport recommended** for some locations
        """.strip()
    
    @staticmethod
    def format_directions_response(query: str, response: str) -> str:
        """Format directions response with proper structure"""
        query_lower = query.lower()
        
        if 'imago' in query_lower and 'mall' in query_lower:
            return NavigationHelper.get_directions_to_imago()
        elif 'sunset' in query_lower and ('kk' in query_lower or 'kota kinabalu' in query_lower):
            return NavigationHelper.get_sunset_locations()
        elif 'halal' in query_lower and 'mee sup' in query_lower:
            return NavigationHelper.get_halal_mee_sup_locations()
        elif 'seafood' in query_lower and ('restaurant' in query_lower or 'kota kinabalu' in query_lower or 'kk' in query_lower):
            return NavigationHelper.get_seafood_restaurants()
        else:
            # Generic directions formatting
            return NavigationHelper._format_generic_directions(response)
    
    @staticmethod
    def _format_generic_directions(response: str) -> str:
        """Format generic directions response"""
        return f"""
## 🗺️ **Directions & Navigation**

### 📍 **Location Information**
{response}

### 🚗 **Getting There**
• **By Car:** Use GPS navigation or follow main roads
• **By Public Transport:** Check local bus routes
• **By Grab/Taxi:** Available throughout Kota Kinabalu

### 📱 **Navigation Apps**
• [Google Maps](https://maps.google.com)
• [Waze](https://waze.com)
• [Grab](https://grab.com/my/transport/)

### 💡 **Pro Tips**
• **Check traffic** before heading out
• **Bring cash** for parking and tolls
• **Download offline maps** for remote areas
• **Ask locals** for the best routes
        """.strip()

# Example usage
if __name__ == "__main__":
    helper = NavigationHelper()
    
    # Test different queries
    print("=== IMAGO MALL DIRECTIONS ===")
    print(helper.get_directions_to_imago())
    
    print("\n=== SUNSET LOCATIONS ===")
    print(helper.get_sunset_locations())
    
    print("\n=== HALAL MEE SUP ===")
    print(helper.get_halal_mee_sup_locations())
    
    print("\n=== SEAFOOD RESTAURANTS ===")
    print(helper.get_seafood_restaurants())
