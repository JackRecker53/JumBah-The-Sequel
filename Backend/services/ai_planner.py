import os
import json
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

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
                "You are MaduAI, a friendly Sabahan travel assistant. Your personality is warm, friendly, and a bit playful, using a mix of English and Sabahan slang.\n\nIMPORTANT FORMATTING RULES:\n- ALWAYS format your responses using bullet points (•)\n- NEVER use paragraphs or long blocks of text\n- Each bullet point should be one clear, concise statement\n- Keep each bullet point under 2 sentences\n- Start with a friendly greeting bullet point\n- Use Sabahan expressions like: 'Boleh bah!', 'ngam-ngam', 'nda payah pusing'\n\nEXAMPLE FORMAT:\n• [Friendly Sabahan greeting]\n• [Main information point 1]\n• [Main information point 2]\n• [Helpful suggestion or tip]\n• [Closing remark or next step]\n\nALWAYS follow this bullet point format - no exceptions!"
            ),
            (
                "human",
                "{input}"
            )
        ])
        
        # Create prompt template for detailed itinerary requests
        self.itinerary_prompt = PromptTemplate(
            input_variables=["destination", "duration", "budget", "preferences", "user_message"],
            template="""
You are JumBah, a friendly and knowledgeable local guide from Sabah, Malaysia. You're helping tourists plan amazing trips!

FORMATTING RULES - MANDATORY:
• ALWAYS use bullet points (•) for ALL responses
• NO paragraphs or long text blocks
• Each bullet point should be under 2 sentences
• Keep responses clean, scannable, and easy to read
• ALWAYS follow this bullet point format - no exceptions!

Create a travel itinerary for {destination} ({duration}) in this EXACT format:

• **Day 1 Morning:** [Activity with brief description]
• **Day 1 Afternoon:** [Activity with brief description]
• **Day 1 Evening:** [Activity with brief description]

• **Accommodation:** [Hotel recommendation with price range]
• **Must-Try Food:** [Local dish and where to find it]
• **Transportation:** [How to get around]
• **Budget Estimate:** [Daily cost breakdown]
• **Local Tip:** [Insider advice for this destination]
• **Best Time to Visit:** [Seasonal recommendations]
• **What to Pack:** [Essential items for the trip]

Keep your Sabahan personality - be warm, helpful, and share local insights!

User's request: {user_message}
Budget: {budget}
Preferences: {preferences}
"""
        )
        
        # Create prompt template for weather requests
        self.weather_prompt = PromptTemplate(
            input_variables=["location", "user_message"],
            template="""
You are JumBah, a friendly and knowledgeable local guide from Sabah, Malaysia. You're helping tourists with weather information.

FORMATTING RULES - MANDATORY:
• ALWAYS use bullet points (•) for ALL responses
• NO paragraphs or long text blocks
• Each bullet point should be under 2 sentences
• Keep responses clean, scannable, and easy to read
• ALWAYS follow this bullet point format - no exceptions!

Provide weather information for {location} in this EXACT format:

• **Current Weather:** [Brief current conditions]
• **Temperature:** [Temperature range with feels-like info]
• **Conditions:** [Sky conditions, humidity, wind]
• **Precipitation:** [Rain/storm probability and timing]
• **Best Times:** [Optimal times for outdoor activities]
• **What to Bring:** [Essential items for the weather]
• **Local Tip:** [Insider advice about weather in this area]

Keep your Sabahan personality - be warm, helpful, and use local insights!

User's question: {user_message}
"""
        )
        
        # Create prompt template for food and restaurant requests
        self.food_prompt = PromptTemplate(
            input_variables=["location", "user_message"],
            template="""
You are JumBah, a friendly and knowledgeable local guide from Sabah, Malaysia. You're helping tourists discover amazing local food!

FORMATTING RULES - MANDATORY:
• ALWAYS use bullet points (•) for ALL responses
• NO paragraphs or long text blocks
• Each bullet point should be under 2 sentences
• Keep responses clean, scannable, and easy to read
• ALWAYS follow this bullet point format - no exceptions!

Provide food recommendations for {location} in this EXACT format:

• **Restaurant Name:** [Name with brief description]
• **Specialty:** [Must-try dishes and what makes them special]
• **Location:** [Specific address or landmark nearby]
• **Price Range:** [Budget-friendly, mid-range, or upscale]
• **Best Time:** [When to visit for best experience]
• **Local Tip:** [Insider advice about ordering or visiting]
• **Cultural Note:** [Brief background about the dish/restaurant]

Keep your Sabahan personality - be warm, enthusiastic about local food, and share insider knowledge!

User's question: {user_message}
"""
        )
    
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
            'recommend', 'suggestion', 'guide', 'route', 'journey',
            'hotel', 'accommodation', 'stay', 'lodge', 'resort', 'hostel',
            'booking', 'room', 'check in', 'check out', 'where to stay'
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
            'bakery', 'market', 'food court', 'hawker', 'kopitiam', 'mamak', 'makan',
            'sedap', 'nyuk', 'mee', 'mi', 'kuih', 'roti', 'teh', 'kopi', 'sup', 'curry'
        ]
        
        restaurant_keywords = [
            'where to eat', 'best restaurant', 'good food', 'recommend restaurant',
            'food recommendation', 'place to eat', 'dining place', 'eatery',
            'food place', 'restaurant near', 'famous food', 'must try food',
            'local cuisine', 'traditional food', 'specialty food', 'where can i find',
            'looking for food', 'want to try', 'craving for', 'best place for',
            'good place to eat', 'food spots', 'dining spots', 'makan place'
        ]
        
        sabah_food_keywords = [
            'hinava', 'ambuyat', 'tuaran mee', 'ngiu chap', 'sang nyuk mien',
            'beaufort mee', 'sabah tea', 'tenom coffee', 'sinalau bakas',
            'pinasakan', 'bosou', 'bambangan', 'sayur manis', 'pansuh',
            'tuhau', 'lihing', 'tapai', 'amplang', 'keropok lekor', 'san nyuk mee',
            'kota kinabalu food', 'sabah food', 'sabahan cuisine', 'local sabah',
            'kedai kopi', 'lintas', 'gaya street', 'filipino market', 'sunday market'
        ]
        
        # Additional food-related phrases that might be missed
        food_phrases = [
            'what to eat', 'where to eat', 'food recommendation', 'best food',
            'hungry', 'looking for food', 'craving', 'want to eat', 'good restaurant',
            'famous restaurant', 'local food', 'must try', 'delicious', 'tasty',
            'food in', 'eat in', 'dine in', 'breakfast at', 'lunch at', 'dinner at',
            'food near', 'restaurant in', 'cafe in', 'makan at', 'sedap food',
            'nyuk mee', 'san nyuk', 'find food', 'food hunting', 'foodie',
            'culinary', 'gastronomy', 'specialty dish', 'signature dish'
        ]
        
        message_lower = message.lower()
        
        # Check for food keywords
        has_food_keyword = any(keyword in message_lower for keyword in food_keywords)
        
        # Check for restaurant-specific phrases
        has_restaurant_keyword = any(keyword in message_lower for keyword in restaurant_keywords)
        
        # Check for Sabah-specific food items
        has_sabah_food = any(keyword in message_lower for keyword in sabah_food_keywords)
        
        # Check for food phrases
        has_food_phrase = any(phrase in message_lower for phrase in food_phrases)
        
        # Check for question patterns that might indicate food requests
        question_patterns = [
            'where can i', 'where should i', 'what should i', 'can you recommend',
            'do you know', 'any good', 'any recommendations', 'suggestions for',
            'looking for', 'searching for', 'trying to find', 'want to find'
        ]
        
        has_question_pattern = any(pattern in message_lower for pattern in question_patterns)
        
        # If it has food-related content
        if has_food_keyword or has_restaurant_keyword or has_sabah_food or has_food_phrase:
            print(f"[DEBUG] Food request detected: {message}")  # Debug logging
            return True
            
        # If it has question patterns combined with location words that might indicate food search
        if has_question_pattern:
            location_food_context = ['in kota kinabalu', 'in kk', 'in sabah', 'near me', 'around here', 'in lintas', 'at gaya street']
            if any(context in message_lower for context in location_food_context):
                # Additional check for implicit food context
                implicit_food = ['good', 'best', 'nice', 'famous', 'popular', 'recommended']
                if any(word in message_lower for word in implicit_food):
                    print(f"[DEBUG] Implicit food request detected: {message}")  # Debug logging
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
            
            # Debug logging
            print(f"[DEBUG] Message: {message}")
            print(f"[DEBUG] Itinerary: {is_itinerary_request}, Weather: {is_weather_request}, Food: {is_food_request}")
            
            if is_itinerary_request:
                # Use detailed itinerary prompt
                chain = self.itinerary_prompt | self.llm
                response_type = "itinerary"
                print(f"[DEBUG] Using itinerary prompt")
                # Generate response with proper parameters
                response = await chain.ainvoke({
                    "destination": "Sabah",
                    "duration": "your trip",
                    "budget": "your budget",
                    "preferences": "your preferences",
                    "user_message": full_message
                })
            elif is_weather_request:
                # Use weather-specific prompt
                chain = self.weather_prompt | self.llm
                response_type = "weather"
                print(f"[DEBUG] Using weather prompt")
                # Generate response with proper parameters
                response = await chain.ainvoke({
                    "location": "Sabah",
                    "user_message": full_message
                })
            elif is_food_request:
                # Use food-specific prompt
                chain = self.food_prompt | self.llm
                response_type = "food"
                print(f"[DEBUG] Using food prompt - should generate detailed response")
                # Generate response with proper parameters
                response = await chain.ainvoke({
                    "location": "Sabah",
                    "user_message": full_message
                })
            else:
                # Use casual conversation prompt
                chain = self.casual_prompt | self.llm
                response_type = "casual"
                print(f"[DEBUG] Using casual prompt")
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
        Save conversation to chat history with AI-generated title
        """
        try:
            history = await self._load_chat_history(user_id)
            
            # Generate AI-powered chat title
            chat_title = await self.generate_chat_title(user_message, ai_response)
            
            new_entry = {
                "timestamp": datetime.now().isoformat(),
                "user_message": user_message,
                "ai_response": ai_response,
                "type": message_type,
                "title": chat_title
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
    
    def delete_chat_history(self, user_id: str) -> Dict:
        """
        Delete chat history for a user
        
        Args:
            user_id: User identifier
        
        Returns:
            Dict containing deletion status
        """
        try:
            history_file = os.path.join(self.history_dir, f"{user_id}_history.json")
            
            if os.path.exists(history_file):
                os.remove(history_file)
                return {
                    "success": True,
                    "message": f"Chat history deleted for user {user_id}"
                }
            else:
                return {
                    "success": True,
                    "message": f"No chat history found for user {user_id}"
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

    async def generate_chat_title(self, user_message: str, ai_response: str) -> str:
        """
        Generate a concise, meaningful chat title using AI based on the conversation content
        
        Args:
            user_message: The user's message
            ai_response: The AI's response
        
        Returns:
            A concise chat title (max 30 characters)
        """
        try:
            # Create a prompt specifically for generating chat titles
            title_prompt = ChatPromptTemplate.from_messages([
                (
                    "system",
                    "You are a title generator. Create a short, descriptive title (maximum 25 characters) that captures the main topic of this conversation. The title should be clear, concise, and helpful for identifying the conversation later. Focus on the key topic, location, or activity discussed. Examples: 'KK Food Guide', 'Mount Kinabalu Trip', 'Sabah Weather', 'Sandakan Mee Places', 'Budget Travel Tips'."
                ),
                (
                    "human",
                    f"User asked: {user_message}\nAI responded about: {ai_response[:200]}...\n\nGenerate a short title for this conversation:"
                )
            ])
            
            chain = title_prompt | self.llm
            response = await chain.ainvoke({})
            
            # Clean and limit the title
            title = response.content.strip().replace('"', '').replace("'", "")
            if len(title) > 25:
                title = title[:22] + "..."
            
            return title
            
        except Exception as e:
            print(f"Error generating chat title: {e}")
            # Fallback to a simple title based on keywords
            return self._generate_fallback_title(user_message)
    
    def _generate_fallback_title(self, user_message: str) -> str:
        """
        Generate a fallback title when AI title generation fails
        """
        message_lower = user_message.lower()
        
        # Define keyword-based titles
        if any(word in message_lower for word in ['food', 'eat', 'restaurant', 'makan']):
            return "Food & Dining"
        elif any(word in message_lower for word in ['weather', 'rain', 'sunny', 'temperature']):
            return "Weather Info"
        elif any(word in message_lower for word in ['hotel', 'accommodation', 'stay', 'lodge']):
            return "Accommodation"
        elif any(word in message_lower for word in ['transport', 'flight', 'bus', 'car', 'travel']):
            return "Transportation"
        elif any(word in message_lower for word in ['itinerary', 'plan', 'trip', 'visit']):
            return "Travel Planning"
        elif any(word in message_lower for word in ['budget', 'cost', 'price', 'money']):
            return "Budget Planning"
        elif any(word in message_lower for word in ['kinabalu', 'kk', 'kota kinabalu']):
            return "Kota Kinabalu"
        elif any(word in message_lower for word in ['sandakan', 'tawau', 'lahad datu']):
            return "East Coast Sabah"
        else:
            # Use first few words of the message
            words = user_message.split()[:3]
            title = ' '.join(words)
            return title[:22] + "..." if len(title) > 22 else title