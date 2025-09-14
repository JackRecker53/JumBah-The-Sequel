import os
import json
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

class AIPlanner:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize the LangChain Gemini model
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)
        
        # Set up chat history storage
        self.history_dir = Path("chat_history")
        self.history_dir.mkdir(exist_ok=True)
        
        # Create prompt template for casual conversations
        self.casual_prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are MaduAI, a friendly travel assistant specializing in Sabah, Malaysia. For casual greetings and simple questions, respond briefly and warmly. Keep responses under 2 sentences unless specifically asked for detailed travel information or itineraries. Always maintain a helpful and welcoming tone."
            ),
            (
                "human",
                "{input}"
            )
        ])
        
        # Create prompt template for detailed itinerary requests
        self.itinerary_prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are MaduAI, an expert travel planner for Sabah, Malaysia. When users request itineraries or detailed travel plans, provide comprehensive, well-structured responses in the following format:\n\n## 📍 [Destination] - [Duration] Itinerary\n\n### Day 1: [Theme/Focus]\n**Morning (9:00 AM - 12:00 PM)**\n• Activity 1 - Brief description\n• Activity 2 - Brief description\n\n**Afternoon (1:00 PM - 5:00 PM)**\n• Activity 3 - Brief description\n• Activity 4 - Brief description\n\n**Evening (6:00 PM - 9:00 PM)**\n• Activity 5 - Brief description\n\n### 🏨 Accommodation Recommendations\n• **Budget Option**: [Name] - [Price range] - [Brief description]\n• **Mid-range Option**: [Name] - [Price range] - [Brief description]\n• **Luxury Option**: [Name] - [Price range] - [Brief description]\n\n### 🍽️ Must-Try Local Food\n• **Dish 1** - Where to find it\n• **Dish 2** - Where to find it\n\n### 💰 Estimated Budget\n• **Budget traveler**: RM [amount] per day\n• **Mid-range traveler**: RM [amount] per day\n• **Luxury traveler**: RM [amount] per day\n\n### 📝 Important Tips\n• Tip 1\n• Tip 2\n• Tip 3\n\n### 🔗 Useful Links & Bookings\n┌─────────────────────────────────────────────────────────────┐\n│ 📱 **Quick Access Links**                                   │\n│ • Book Hotels: https://www.booking.com/city/my/kota-kinabalu │\n│ • Flight Tickets: https://www.skyscanner.com                │\n│ • Local Tours: https://www.klook.com/city/20-kota-kinabalu  │\n│ • Car Rental: https://www.rentalcars.com                    │\n│ • Weather Info: https://weather.com/weather/today/l/kota+kinabalu │\n└─────────────────────────────────────────────────────────────┘\n\nAlways focus on authentic Sabah experiences, local culture, and practical advice."
            ),
            (
                "human",
                "{input}"
            )
        ])
        
        # Create prompt template for weather requests
        self.weather_prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are MaduAI, a helpful weather assistant for Sabah, Malaysia. When users ask about weather, provide well-formatted responses using this structure:\n\n## 🌤️ Weather Forecast for [Location]\n\n### 📅 **[Date/Time Period]**\n\n**🌡️ Temperature**\n• Current: [Temperature]\n• High: [High temp] | Low: [Low temp]\n\n**☁️ Conditions**\n• [Weather description]\n• Humidity: [percentage]%\n• Wind: [speed and direction]\n\n**🌧️ Precipitation**\n• Chance of rain: [percentage]%\n• Expected rainfall: [amount if applicable]\n\n### 🎒 **Travel Recommendations**\n• **What to pack**: [clothing suggestions]\n• **Best activities**: [weather-appropriate activities]\n• **Travel tips**: [practical advice for the weather]\n\n### 📱 **Quick Weather Links**\n┌─────────────────────────────────────────────────────────────┐\n│ 🌦️ **Live Weather Updates**                                │\n│ • Detailed Forecast: https://weather.com/weather/today     │\n│ • Radar Map: https://weather.com/weather/radar             │\n│ • Weather Alerts: https://weather.com/weather/alerts       │\n└─────────────────────────────────────────────────────────────┘\n\nAlways provide practical travel advice based on the weather conditions."
            ),
            (
                "human",
                "{input}"
            )
        ])
        
        # Create prompt template for food and restaurant requests
        self.food_prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are MaduAI, a local food expert for Sabah, Malaysia. When users ask about food, restaurants, or dining recommendations, provide well-formatted responses using this structure:\n\n## 🍽️ Food Recommendations for [Location/Cuisine Type]\n\n### 🏆 **Top Recommendations**\n\n**🍜 [Restaurant Name]**\n• 📍 Location: [Full address with area]\n• 🕒 Hours: [Operating hours]\n• 💰 Price Range: [Budget range, e.g., RM15-25 per person]\n• ⭐ Specialty: [Signature dishes]\n• 📱 Contact: [Phone number if available]\n• 🗺️ [Google Maps](https://maps.google.com/search/[Restaurant+Name+Location])\n\n**🥘 [Restaurant Name 2]**\n• 📍 Location: [Full address with area]\n• 🕒 Hours: [Operating hours]\n• 💰 Price Range: [Budget range]\n• ⭐ Specialty: [Signature dishes]\n• 📱 Contact: [Phone number if available]\n• 🗺️ [Google Maps](https://maps.google.com/search/[Restaurant+Name+Location])\n\n### 🍲 **Local Food Culture**\n• [Brief cultural context about the dish/cuisine]\n• [Best time to visit or eating customs]\n• [What makes this food special in Sabah]\n\n### 🔗 **Useful Food Links**\n┌─────────────────────────────────────────────────────────────┐\n│ 🍴 [Zomato Sabah](https://zomato.com/malaysia/sabah)         │\n│ 📱 [FoodPanda](https://foodpanda.com.my)                     │\n│ 🗺️ [Google Maps Food](https://maps.google.com/search/restaurants+near+me) │\n│ 📖 [TripAdvisor](https://tripadvisor.com/restaurants)        │\n└─────────────────────────────────────────────────────────────┘\n\nProvide authentic, local food recommendations with practical details for visitors to Sabah, Malaysia."
            ),
            (
                "human",
                "{input}"
            )
        ])
    
    async def generate_travel_plan(
        self, 
        destination: str, 
        duration: str, 
        budget: Optional[str] = None,
        preferences: Optional[List[str]] = None,
        user_id: Optional[str] = "anonymous"
    ) -> Dict:
        """
        Generate a travel plan using Gemini AI
        
        Args:
            destination: Travel destination
            duration: Trip duration (e.g., "3 days", "1 week")
            budget: Budget range (e.g., "$500-1000")
            preferences: List of preferences (e.g., ["adventure", "culture"])
            user_id: User identifier for chat history
        
        Returns:
            Dict containing the generated travel plan
        """
        try:
            # Build the prompt
            prompt_text = self._build_travel_prompt(destination, duration, budget, preferences)
            
            # Create the chain
            chain = self.itinerary_prompt | self.llm
            
            # Generate response
            response = await chain.ainvoke({"input": prompt_text})
            
            # Save to history
            await self._save_to_history(user_id, prompt_text, response.content, "travel_plan")
            
            return {
                "success": True,
                "plan": response.content,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error generating travel plan: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _is_itinerary_request(self, message: str) -> bool:
        """
        Detect if the user is requesting an itinerary or detailed travel plan
        """
        itinerary_keywords = [
            'itinerary', 'plan', 'trip', 'travel plan', 'schedule', 'agenda',
            'day plan', 'days', 'visit', 'tour', 'vacation', 'holiday',
            'things to do', 'activities', 'places to visit', 'attractions',
            'recommend', 'suggestion', 'guide', 'route', 'journey'
        ]
        
        duration_keywords = [
            '1 day', '2 day', '3 day', '4 day', '5 day', '6 day', '7 day',
            'one day', 'two day', 'three day', 'four day', 'five day',
            'week', 'weekend', 'month', 'days'
        ]
        
        message_lower = message.lower()
        
        # Check for itinerary keywords
        has_itinerary_keyword = any(keyword in message_lower for keyword in itinerary_keywords)
        
        # Check for duration mentions
        has_duration = any(keyword in message_lower for keyword in duration_keywords)
        
        # Check for question words that typically indicate planning requests
        planning_questions = ['what', 'where', 'how', 'which', 'when']
        has_planning_question = any(word in message_lower for word in planning_questions)
        
        # If message is very short (like "hello", "hi", "thanks"), it's likely casual
        if len(message.split()) <= 2 and not has_itinerary_keyword:
            return False
            
        # If it has duration + itinerary keywords, definitely an itinerary request
        if has_duration and has_itinerary_keyword:
            return True
            
        # If it has itinerary keywords + planning questions, likely an itinerary request
        if has_itinerary_keyword and has_planning_question:
            return True
            
        # If it mentions specific places in Sabah with planning intent
        sabah_places = ['kota kinabalu', 'sandakan', 'tawau', 'lahad datu', 'semporna', 
                       'mount kinabalu', 'kinabalu park', 'sepilok', 'danum valley',
                       'maliau basin', 'sipadan', 'mabul', 'kapalai', 'mantanani']
        
        has_sabah_place = any(place in message_lower for place in sabah_places)
        
        if has_sabah_place and (has_planning_question or has_itinerary_keyword):
            return True
            
        return False
    
    def _is_weather_request(self, message: str) -> bool:
        """
        Detect if the user is asking about weather information
        """
        weather_keywords = [
            'weather', 'forecast', 'temperature', 'rain', 'sunny', 'cloudy',
            'hot', 'cold', 'humid', 'climate', 'precipitation', 'storm',
            'wind', 'humidity', 'degrees', 'celsius', 'fahrenheit',
            'today weather', 'tomorrow weather', 'weather like',
            'weather forecast', 'weather condition', 'weather update'
        ]
        
        time_keywords = [
            'today', 'tomorrow', 'tonight', 'this week', 'next week',
            'weekend', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday'
        ]
        
        message_lower = message.lower()
        
        # Check for weather keywords
        has_weather_keyword = any(keyword in message_lower for keyword in weather_keywords)
        
        # Check for time-related keywords that often accompany weather queries
        has_time_keyword = any(keyword in message_lower for keyword in time_keywords)
        
        # Common weather question patterns
        weather_patterns = [
            "what's the weather", "how's the weather", "weather like",
            "is it raining", "will it rain", "temperature", "hot today",
            "cold today", "sunny today", "cloudy today"
        ]
        
        has_weather_pattern = any(pattern in message_lower for pattern in weather_patterns)
        
        # If it has weather keywords or patterns, it's likely a weather request
        if has_weather_keyword or has_weather_pattern:
            return True
            
        # If it has time keywords with weather context
        if has_time_keyword and ('like' in message_lower or '?' in message):
            # Additional check for weather context
            weather_context = ['outside', 'bring umbrella', 'wear', 'dress']
            if any(context in message_lower for context in weather_context):
                return True
                
        return False
    
    def _is_food_request(self, message: str) -> bool:
        """
        Detect if the user is asking about food, restaurants, or dining recommendations
        """
        food_keywords = [
            'food', 'restaurant', 'eat', 'dining', 'meal', 'breakfast', 'lunch', 'dinner',
            'cuisine', 'dish', 'menu', 'cafe', 'coffee', 'drink', 'hungry', 'delicious',
            'tasty', 'local food', 'street food', 'seafood', 'halal', 'vegetarian',
            'noodles', 'rice', 'chicken', 'beef', 'pork', 'fish', 'dessert', 'snack',
            'bakery', 'market', 'food court', 'hawker', 'kopitiam', 'mamak'
        ]
        
        restaurant_keywords = [
            'where to eat', 'best restaurant', 'good food', 'recommend restaurant',
            'food recommendation', 'place to eat', 'dining place', 'eatery',
            'food place', 'restaurant near', 'famous food', 'must try food',
            'local cuisine', 'traditional food', 'specialty food'
        ]
        
        sabah_food_keywords = [
            'hinava', 'ambuyat', 'tuaran mee', 'ngiu chap', 'sang nyuk mien',
            'beaufort mee', 'sabah tea', 'tenom coffee', 'sinalau bakas',
            'pinasakan', 'bosou', 'bambangan', 'sayur manis', 'pansuh',
            'tuhau', 'lihing', 'tapai', 'amplang', 'keropok lekor'
        ]
        
        message_lower = message.lower()
        
        # Check for food keywords
        has_food_keyword = any(keyword in message_lower for keyword in food_keywords)
        
        # Check for restaurant-specific phrases
        has_restaurant_keyword = any(keyword in message_lower for keyword in restaurant_keywords)
        
        # Check for Sabah-specific food items
        has_sabah_food = any(keyword in message_lower for keyword in sabah_food_keywords)
        
        # Common food question patterns
        food_patterns = [
            "where can i eat", "what to eat", "food recommendation", "best food",
            "hungry", "looking for food", "craving", "want to eat", "good restaurant",
            "famous restaurant", "local food", "must try", "delicious"
        ]
        
        has_food_pattern = any(pattern in message_lower for pattern in food_patterns)
        
        # If it has food keywords, restaurant keywords, or Sabah food items
        if has_food_keyword or has_restaurant_keyword or has_sabah_food or has_food_pattern:
            return True
            
        return False
    
    async def chat_with_ai(
        self, 
        message: str, 
        user_id: str = "anonymous", 
        context: Optional[str] = None
    ) -> Dict:
        """
        Chat with AI assistant
        
        Args:
            message: User's message
            user_id: User identifier
            context: Additional context for the conversation
        
        Returns:
            Dict containing AI response
        """
        try:
            # Load chat history
            history = await self._load_chat_history(user_id)
            
            # Build context-aware prompt
            if context:
                full_message = f"Context: {context}\n\nUser message: {message}"
            else:
                full_message = message
            
            # Determine which prompt template to use
            is_itinerary_request = self._is_itinerary_request(message)
            is_weather_request = self._is_weather_request(message)
            is_food_request = self._is_food_request(message)
            
            if is_itinerary_request:
                # Use detailed itinerary prompt
                chain = self.itinerary_prompt | self.llm
                response_type = "itinerary"
            elif is_weather_request:
                # Use weather-specific prompt
                chain = self.weather_prompt | self.llm
                response_type = "weather"
            elif is_food_request:
                # Use food-specific prompt
                chain = self.food_prompt | self.llm
                response_type = "food"
            else:
                # Use casual conversation prompt
                chain = self.casual_prompt | self.llm
                response_type = "casual"
            
            # Generate response
            response = await chain.ainvoke({"input": full_message})
            
            # Save to history
            await self._save_to_history(user_id, message, response.content, response_type)
            
            return {
                "success": True,
                "response": response.content,
                "timestamp": datetime.now().isoformat(),
                "response_type": response_type
            }
            
        except Exception as e:
            print(f"Error in chat: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _build_travel_prompt(self, destination: str, duration: str, budget: Optional[str], preferences: Optional[List[str]]) -> str:
        """
        Build a comprehensive travel planning prompt
        """
        prompt = f"Create a detailed travel plan for {destination} for {duration}."
        
        if budget:
            prompt += f" Budget: {budget}."
        
        if preferences:
            prompt += f" Preferences: {', '.join(preferences)}."
        
        prompt += """
        
        Please include:
        1. Daily itinerary with specific activities and timings
        2. Recommended accommodations with price ranges
        3. Local transportation options
        4. Must-try local foods and restaurants
        5. Cultural insights and local customs
        6. Budget breakdown if budget was provided
        7. Packing suggestions
        8. Safety tips and important information
        
        Focus especially on Sabah-specific attractions, local experiences, and practical advice for travelers.
        """
        
        return prompt
    
    async def _load_chat_history(self, user_id: str) -> List[Dict]:
        """
        Load chat history for a user
        """
        history_file = self.history_dir / f"{user_id}_history.json"
        
        if history_file.exists():
            try:
                with open(history_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading chat history: {e}")
                return []
        
        return []
    
    async def _save_to_history(self, user_id: str, user_message: str, ai_response: str, message_type: str = "chat"):
        """
        Save conversation to chat history
        """
        try:
            history = await self._load_chat_history(user_id)
            
            new_entry = {
                "timestamp": datetime.now().isoformat(),
                "user_message": user_message,
                "ai_response": ai_response,
                "type": message_type
            }
            
            history.append(new_entry)
            
            # Keep only last 50 conversations to manage file size
            if len(history) > 50:
                history = history[-50:]
            
            history_file = self.history_dir / f"{user_id}_history.json"
            with open(history_file, 'w', encoding='utf-8') as f:
                json.dump(history, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            print(f"Error saving to history: {e}")
    
    async def get_chat_history(self, user_id: str) -> Dict:
        """
        Get chat history for a user
        
        Args:
            user_id: User identifier
        
        Returns:
            Dict containing chat history
        """
        try:
            history = await self._load_chat_history(user_id)
            return {
                "success": True,
                "history": history
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def health_check(self) -> Dict:
        """
        Check if the AI service is working
        
        Returns:
            Dict containing health status
        """
        try:
            # Test with a simple prompt
            chain = self.casual_prompt | self.llm
            response = await chain.ainvoke({"input": "Hello, are you working?"})
            
            return {
                "success": True,
                "status": "healthy",
                "message": "AI service is working properly",
                "test_response": response.content
            }
        except Exception as e:
            return {
                "success": False,
                "status": "unhealthy",
                "error": str(e)
            }