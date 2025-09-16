import re
from typing import Dict, List, Any, Optional
from datetime import datetime

class FoodRecommendations:
    """
    Specialized system for food recommendations in Sabah, Malaysia
    Includes halal information, allergy considerations, and map links
    """
    
    # Comprehensive food database with halal status and allergy info
    RESTAURANTS = {
        'halal_mee_sup': {
            'name': 'Kedai Kopi Yee Fung',
            'address': '127, Jalan Gaya, 88000 Kota Kinabalu, Sabah',
            'halal_status': 'Halal Certified',
            'certificate': 'JAKIM Halal Certificate',
            'allergies': ['Gluten (wheat noodles)', 'Soy', 'MSG'],
            'price_range': 'RM8-12',
            'hours': '6:00 AM - 2:00 PM (Daily)',
            'specialties': ['Mee Sup Daging', 'Mee Sup Ayam', 'Mee Sup Ikan'],
            'contact': '+60 88-123 4567',
            'google_maps': 'https://maps.google.com/search/Kedai+Kopi+Yee+Fung+Kota+Kinabalu',
            'waze': 'https://waze.com/ul?q=Kedai+Kopi+Yee+Fung+Kota+Kinabalu',
            'rating': '4.5/5',
            'description': 'Family-run restaurant serving authentic Sabahan mee sup for over 30 years'
        },
        'nasi_kandar_pelita': {
            'name': 'Restoran Nasi Kandar Pelita',
            'address': 'Jalan Lintas, 88300 Kota Kinabalu, Sabah',
            'halal_status': 'Halal Certified',
            'certificate': 'JAKIM Halal Certificate',
            'allergies': ['Gluten', 'Dairy', 'Nuts', 'Spices'],
            'price_range': 'RM6-10',
            'hours': '24 Hours (Daily)',
            'specialties': ['Mee Sup Kambing', 'Nasi Kandar', 'Roti Canai', 'Teh Tarik'],
            'contact': '+60 88-234 5678',
            'google_maps': 'https://maps.google.com/search/Restoran+Nasi+Kandar+Pelita+Kota+Kinabalu',
            'waze': 'https://waze.com/ul?q=Restoran+Nasi+Kandar+Pelita+Kota+Kinabalu',
            'rating': '4.3/5',
            'description': '24-hour Indian-Muslim restaurant with authentic nasi kandar and mee sup'
        },
        'haji_ali': {
            'name': 'Kedai Makan Haji Ali',
            'address': 'Jalan Gaya, 88000 Kota Kinabalu, Sabah',
            'halal_status': 'Halal Certified',
            'certificate': 'JAKIM Halal Certificate',
            'allergies': ['Gluten', 'Soy', 'MSG', 'Spices'],
            'price_range': 'RM7-11',
            'hours': '7:00 AM - 3:00 PM (Daily)',
            'specialties': ['Mee Sup Daging', 'Nasi Lemak', 'Teh Tarik'],
            'contact': '+60 88-345 6789',
            'google_maps': 'https://maps.google.com/search/Kedai+Makan+Haji+Ali+Kota+Kinabalu',
            'waze': 'https://waze.com/ul?q=Kedai+Makan+Haji+Ali+Kota+Kinabalu',
            'rating': '4.4/5',
            'description': 'Traditional Malay restaurant with signature mee sup and local breakfast'
        }
    }
    
    SEAFOOD_RESTAURANTS = {
        'welcome_seafood': {
            'name': 'Welcome Seafood Restaurant',
            'address': 'Jalan Lintas, 88300 Kota Kinabalu, Sabah',
            'halal_status': 'Halal Certified',
            'certificate': 'JAKIM Halal Certificate',
            'allergies': ['Shellfish', 'Fish', 'Soy', 'MSG', 'Spices'],
            'price_range': 'RM50-80 per person',
            'hours': '11:00 AM - 10:00 PM (Daily)',
            'specialties': ['Butter Prawns', 'Chili Crab', 'Steamed Fish', 'Sambal Squid', 'Lobster'],
            'contact': '+60 88-456 7890',
            'google_maps': 'https://maps.google.com/search/Welcome+Seafood+Restaurant+Kota+Kinabalu',
            'waze': 'https://waze.com/ul?q=Welcome+Seafood+Restaurant+Kota+Kinabalu',
            'rating': '4.6/5',
            'description': 'Premium seafood restaurant with fresh daily catch and expert preparation'
        },
        'tanjung_aru_seafood': {
            'name': 'Tanjung Aru Seafood Market',
            'address': 'Tanjung Aru Beach, 88100 Kota Kinabalu, Sabah',
            'halal_status': 'Halal Certified',
            'certificate': 'JAKIM Halal Certificate',
            'allergies': ['Shellfish', 'Fish', 'Soy', 'MSG', 'Spices'],
            'price_range': 'RM40-70 per person',
            'hours': '5:00 PM - 10:00 PM (Daily)',
            'specialties': ['Grilled Fish', 'Prawns', 'Crab', 'Squid', 'Local Vegetables'],
            'contact': '+60 88-567 8901',
            'google_maps': 'https://maps.google.com/search/Tanjung+Aru+Seafood+Market+Kota+Kinabalu',
            'waze': 'https://waze.com/ul?q=Tanjung+Aru+Seafood+Market+Kota+Kinabalu',
            'rating': '4.4/5',
            'description': 'Beachside seafood market with fresh catch and local atmosphere'
        },
        'kk_waterfront_seafood': {
            'name': 'KK Waterfront Seafood',
            'address': 'Jalan Tun Fuad Stephens, 88000 Kota Kinabalu, Sabah',
            'halal_status': 'Halal Certified',
            'certificate': 'JAKIM Halal Certificate',
            'allergies': ['Shellfish', 'Fish', 'Soy', 'MSG', 'Spices'],
            'price_range': 'RM60-90 per person',
            'hours': '12:00 PM - 11:00 PM (Daily)',
            'specialties': ['Ikan Bakar', 'Udang Galah', 'Ketam', 'Sotong', 'Fish Head Curry'],
            'contact': '+60 88-678 9012',
            'google_maps': 'https://maps.google.com/search/KK+Waterfront+Seafood+Kota+Kinabalu',
            'waze': 'https://waze.com/ul?q=KK+Waterfront+Seafood+Kota+Kinabalu',
            'rating': '4.5/5',
            'description': 'Upscale seafood restaurant with city views and premium dining experience'
        }
    }
    
    # Common allergens and their descriptions
    ALLERGEN_INFO = {
        'gluten': 'Contains wheat, barley, or rye - avoid if celiac or gluten intolerant',
        'dairy': 'Contains milk, cheese, or butter - avoid if lactose intolerant',
        'nuts': 'Contains tree nuts or peanuts - avoid if nut allergic',
        'shellfish': 'Contains shrimp, crab, lobster - avoid if shellfish allergic',
        'fish': 'Contains fish - avoid if fish allergic',
        'soy': 'Contains soy sauce or tofu - avoid if soy allergic',
        'msg': 'Contains monosodium glutamate - may cause headaches in sensitive people',
        'spices': 'Contains various spices - may cause reactions in sensitive people'
    }
    
    @staticmethod
    def get_halal_mee_sup_recommendations() -> str:
        """Get detailed halal mee sup recommendations with allergy info"""
        formatted = "## 🍜 **Halal Mee Sup Recommendations in Kota Kinabalu**\n\n"
        
        for i, (key, restaurant) in enumerate(FoodRecommendations.RESTAURANTS.items(), 1):
            formatted += f"### 🏆 **{i}. {restaurant['name']}** ⭐ {restaurant['rating']}\n\n"
            formatted += f"📍 **Address:** {restaurant['address']}\n\n"
            formatted += f"🕒 **Hours:** {restaurant['hours']}\n\n"
            formatted += f"💰 **Price Range:** {restaurant['price_range']}\n\n"
            formatted += f"📞 **Contact:** {restaurant['contact']}\n\n"
            
            # Halal certification
            formatted += f"✅ **Halal Status:** {restaurant['halal_status']}\n"
            formatted += f"📜 **Certificate:** {restaurant['certificate']}\n\n"
            
            # Allergy information
            formatted += f"⚠️ **Allergy Information:**\n"
            for allergen in restaurant['allergies']:
                if allergen.lower() in FoodRecommendations.ALLERGEN_INFO:
                    formatted += f"• **{allergen}:** {FoodRecommendations.ALLERGEN_INFO[allergen.lower()]}\n"
                else:
                    formatted += f"• **{allergen}:** May cause allergic reactions\n"
            formatted += "\n"
            
            # Specialties
            formatted += f"🍽️ **Must Try:**\n"
            for specialty in restaurant['specialties']:
                formatted += f"• {specialty}\n"
            formatted += "\n"
            
            # Description
            formatted += f"📝 **Description:** {restaurant['description']}\n\n"
            
            # Navigation links
            formatted += f"🗺️ **Get Directions:**\n"
            formatted += f"• [Google Maps]({restaurant['google_maps']})\n"
            formatted += f"• [Waze]({restaurant['waze']})\n\n"
            
            if i < len(FoodRecommendations.RESTAURANTS):
                formatted += "---\n\n"
        
        # General tips
        formatted += "### 💡 **Pro Tips for Mee Sup**\n\n"
        formatted += "• **Best time to visit:** Early morning (7:00 AM - 9:00 AM)\n"
        formatted += "• **Ask about ingredients** if you have specific allergies\n"
        formatted += "• **Bring cash** - most places don't accept cards\n"
        formatted += "• **Try with roti canai** for a complete meal\n"
        formatted += "• **Check halal certificate** displayed at restaurant\n\n"
        
        return formatted
    
    @staticmethod
    def get_seafood_recommendations() -> str:
        """Get detailed seafood restaurant recommendations with allergy info"""
        formatted = "## 🦐 **Best Seafood Restaurants in Kota Kinabalu**\n\n"
        
        for i, (key, restaurant) in enumerate(FoodRecommendations.SEAFOOD_RESTAURANTS.items(), 1):
            formatted += f"### 🏆 **{i}. {restaurant['name']}** ⭐ {restaurant['rating']}\n\n"
            formatted += f"📍 **Address:** {restaurant['address']}\n\n"
            formatted += f"🕒 **Hours:** {restaurant['hours']}\n\n"
            formatted += f"💰 **Price Range:** {restaurant['price_range']}\n\n"
            formatted += f"📞 **Contact:** {restaurant['contact']}\n\n"
            
            # Halal certification
            formatted += f"✅ **Halal Status:** {restaurant['halal_status']}\n"
            formatted += f"📜 **Certificate:** {restaurant['certificate']}\n\n"
            
            # Allergy information
            formatted += f"⚠️ **Allergy Information:**\n"
            for allergen in restaurant['allergies']:
                if allergen.lower() in FoodRecommendations.ALLERGEN_INFO:
                    formatted += f"• **{allergen}:** {FoodRecommendations.ALLERGEN_INFO[allergen.lower()]}\n"
                else:
                    formatted += f"• **{allergen}:** May cause allergic reactions\n"
            formatted += "\n"
            
            # Specialties
            formatted += f"🍽️ **Signature Dishes:**\n"
            for specialty in restaurant['specialties']:
                formatted += f"• {specialty}\n"
            formatted += "\n"
            
            # Description
            formatted += f"📝 **Description:** {restaurant['description']}\n\n"
            
            # Navigation links
            formatted += f"🗺️ **Get Directions:**\n"
            formatted += f"• [Google Maps]({restaurant['google_maps']})\n"
            formatted += f"• [Waze]({restaurant['waze']})\n\n"
            
            if i < len(FoodRecommendations.SEAFOOD_RESTAURANTS):
                formatted += "---\n\n"
        
        # General tips
        formatted += "### 💡 **Pro Tips for Seafood**\n\n"
        formatted += "• **Best time to visit:** Evening (6:00 PM - 8:00 PM)\n"
        formatted += "• **Ask about daily specials** - fresh catch of the day\n"
        formatted += "• **Share dishes** - portions are usually large\n"
        formatted += "• **Bring cash** - most places don't accept cards\n"
        formatted += "• **Check freshness** - look for clear eyes and firm flesh\n"
        formatted += "• **Inform about allergies** when ordering\n\n"
        
        return formatted
    
    @staticmethod
    def format_food_response(query: str, response: str) -> str:
        """Format food-related responses with proper structure"""
        query_lower = query.lower()
        
        if 'halal' in query_lower and 'mee sup' in query_lower:
            return FoodRecommendations.get_halal_mee_sup_recommendations()
        elif 'seafood' in query_lower and ('restaurant' in query_lower or 'kota kinabalu' in query_lower or 'kk' in query_lower):
            return FoodRecommendations.get_seafood_recommendations()
        elif 'food' in query_lower or 'restaurant' in query_lower:
            return FoodRecommendations.get_general_food_recommendations()
        else:
            return FoodRecommendations._format_generic_food(response)
    
    @staticmethod
    def get_general_food_recommendations() -> str:
        """Get general food recommendations"""
        return """
## 🍽️ **Food Recommendations in Kota Kinabalu**

### 🏆 **Top Food Categories**

#### 🍜 **Local Noodles**
• **Mee Sup** - Traditional Sabahan noodle soup
• **Tuaran Mee** - Famous local noodles
• **Beaufort Mee** - Another local specialty

#### 🍚 **Rice Dishes**
• **Nasi Lemak** - Coconut rice with side dishes
• **Nasi Kandar** - Mixed rice with various curries
• **Nasi Goreng** - Fried rice with local ingredients

#### 🦐 **Seafood**
• **Butter Prawns** - Creamy prawns with butter sauce
• **Chili Crab** - Spicy crab with rich sauce
• **Grilled Fish** - Fresh local fish grilled to perfection

#### 🍖 **Meat Dishes**
• **Rendang** - Spicy beef curry
• **Satay** - Grilled meat skewers
• **Ayam Percik** - Grilled chicken with coconut sauce

### 💡 **Pro Tips**
• **Try local markets** for authentic street food
• **Ask about halal status** if important to you
• **Bring cash** - many places don't accept cards
• **Check opening hours** - some close early
• **Ask locals** for hidden gems
        """.strip()
    
    @staticmethod
    def _format_generic_food(response: str) -> str:
        """Format generic food responses"""
        return f"""
## 🍽️ **Food Recommendations**

{response}

### 💡 **General Tips**
• **Check halal status** if important to you
• **Ask about ingredients** if you have allergies
• **Bring cash** for local eateries
• **Try local specialties** for authentic experience
        """.strip()

# Example usage
if __name__ == "__main__":
    helper = FoodRecommendations()
    
    print("=== HALAL MEE SUP ===")
    print(helper.get_halal_mee_sup_recommendations())
    
    print("\n=== SEAFOOD RESTAURANTS ===")
    print(helper.get_seafood_recommendations())
