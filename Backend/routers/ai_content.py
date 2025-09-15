from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random
from datetime import datetime, timedelta

router = APIRouter()

# Data models
class PersonalizedRecommendation(BaseModel):
    quest_id: str
    title: str
    description: str
    difficulty: str
    estimated_time: str
    location: str
    quest_type: str
    recommendation_reason: str
    confidence_score: float

class DynamicContent(BaseModel):
    content_id: str
    content_type: str  # "tip", "fact", "story", "challenge"
    title: str
    content: str
    location_context: Optional[str] = None
    difficulty_level: str
    tags: List[str]
    generated_at: datetime

class UserBehaviorAnalysis(BaseModel):
    user_id: str
    preferred_quest_types: List[str]
    difficulty_preference: str
    time_of_day_preference: str
    location_preferences: List[str]
    completion_rate: float
    average_session_duration: int  # minutes

class AIInsight(BaseModel):
    insight_type: str  # "performance", "recommendation", "achievement_prediction"
    title: str
    description: str
    actionable_tips: List[str]
    confidence: float

# In-memory storage for demo
user_behaviors = {}
generated_content = []

# Sample quest data for recommendations
SAMPLE_QUESTS = [
    {
        "quest_id": "cultural-heritage-1",
        "title": "Discover Kadazan-Dusun Culture",
        "description": "Learn about the indigenous culture of Sabah through interactive experiences",
        "difficulty": "Easy",
        "estimated_time": "30 minutes",
        "location": "Cultural Centre, Kota Kinabalu",
        "quest_type": "cultural",
        "tags": ["culture", "heritage", "indigenous", "interactive"]
    },
    {
        "quest_id": "nature-adventure-1",
        "title": "Kinabalu Park Biodiversity Hunt",
        "description": "Explore the rich biodiversity of Mount Kinabalu National Park",
        "difficulty": "Medium",
        "estimated_time": "2 hours",
        "location": "Kinabalu Park",
        "quest_type": "nature",
        "tags": ["nature", "biodiversity", "hiking", "photography"]
    },
    {
        "quest_id": "food-discovery-1",
        "title": "Traditional Sabahan Cuisine Trail",
        "description": "Taste and learn about authentic Sabahan dishes and ingredients",
        "difficulty": "Easy",
        "estimated_time": "1 hour",
        "location": "Gaya Street Market",
        "quest_type": "food",
        "tags": ["food", "culture", "market", "local"]
    },
    {
        "quest_id": "adventure-extreme-1",
        "title": "White Water Rafting Challenge",
        "description": "Navigate the rapids of Kiulu River in this thrilling adventure",
        "difficulty": "Hard",
        "estimated_time": "4 hours",
        "location": "Kiulu River",
        "quest_type": "adventure",
        "tags": ["adventure", "water", "extreme", "teamwork"]
    },
    {
        "quest_id": "wildlife-photography-1",
        "title": "Orangutan Conservation Experience",
        "description": "Learn about orangutan conservation while capturing amazing photos",
        "difficulty": "Medium",
        "estimated_time": "3 hours",
        "location": "Sepilok Orangutan Sanctuary",
        "quest_type": "wildlife",
        "tags": ["wildlife", "photography", "conservation", "education"]
    }
]

def analyze_user_behavior(user_id: str, completed_quests: List[Dict]) -> UserBehaviorAnalysis:
    """Analyze user behavior patterns from completed quests"""
    if not completed_quests:
        return UserBehaviorAnalysis(
            user_id=user_id,
            preferred_quest_types=["cultural"],
            difficulty_preference="Easy",
            time_of_day_preference="morning",
            location_preferences=["Kota Kinabalu"],
            completion_rate=0.0,
            average_session_duration=30
        )
    
    # Analyze quest type preferences
    quest_types = [quest.get("quest_type", "cultural") for quest in completed_quests]
    preferred_types = list(set(quest_types))
    
    # Analyze difficulty preference
    difficulties = [quest.get("difficulty", "Easy") for quest in completed_quests]
    difficulty_counts = {d: difficulties.count(d) for d in set(difficulties)}
    preferred_difficulty = max(difficulty_counts, key=difficulty_counts.get) if difficulty_counts else "Easy"
    
    # Calculate completion rate (simplified)
    completion_rate = min(len(completed_quests) / 10.0, 1.0)  # Assume 10 total quests for demo
    
    return UserBehaviorAnalysis(
        user_id=user_id,
        preferred_quest_types=preferred_types,
        difficulty_preference=preferred_difficulty,
        time_of_day_preference="morning",  # Default for demo
        location_preferences=["Kota Kinabalu", "Kinabalu Park"],
        completion_rate=completion_rate,
        average_session_duration=random.randint(30, 120)
    )

def generate_personalized_recommendations(behavior: UserBehaviorAnalysis, limit: int = 5) -> List[PersonalizedRecommendation]:
    """Generate personalized quest recommendations based on user behavior"""
    recommendations = []
    
    for quest in SAMPLE_QUESTS[:limit]:
        # Calculate recommendation score based on user preferences
        score = 0.5  # Base score
        
        # Boost score for preferred quest types
        if quest["quest_type"] in behavior.preferred_quest_types:
            score += 0.3
        
        # Boost score for preferred difficulty
        if quest["difficulty"] == behavior.difficulty_preference:
            score += 0.2
        
        # Generate recommendation reason
        reasons = []
        if quest["quest_type"] in behavior.preferred_quest_types:
            reasons.append(f"matches your interest in {quest['quest_type']} activities")
        if quest["difficulty"] == behavior.difficulty_preference:
            reasons.append(f"aligns with your preferred {quest['difficulty'].lower()} difficulty level")
        
        reason = "Based on your activity history, this quest " + " and ".join(reasons) if reasons else "is popular among similar users"
        
        recommendations.append(PersonalizedRecommendation(
            quest_id=quest["quest_id"],
            title=quest["title"],
            description=quest["description"],
            difficulty=quest["difficulty"],
            estimated_time=quest["estimated_time"],
            location=quest["location"],
            quest_type=quest["quest_type"],
            recommendation_reason=reason,
            confidence_score=min(score, 1.0)
        ))
    
    # Sort by confidence score
    recommendations.sort(key=lambda x: x.confidence_score, reverse=True)
    return recommendations

def generate_dynamic_content(content_type: str, user_context: Dict = None) -> DynamicContent:
    """Generate dynamic content based on type and user context"""
    content_templates = {
        "tip": {
            "titles": [
                "Pro Tip for Your Adventure",
                "Local Insider Knowledge",
                "Make the Most of Your Visit",
                "Expert Recommendation"
            ],
            "contents": [
                "Visit early in the morning to avoid crowds and enjoy cooler temperatures.",
                "Bring a reusable water bottle - many locations have refill stations.",
                "Download offline maps before heading to remote areas.",
                "Learn a few basic Malay phrases to connect with locals.",
                "Pack light rain gear - tropical weather can be unpredictable."
            ]
        },
        "fact": {
            "titles": [
                "Did You Know?",
                "Fascinating Sabah Fact",
                "Amazing Discovery",
                "Local Knowledge"
            ],
            "contents": [
                "Mount Kinabalu grows about 5mm taller each year due to tectonic activity.",
                "Sabah is home to the world's largest flower - the Rafflesia.",
                "The Kinabatangan River is one of the longest rivers in Malaysia.",
                "Sabah has over 200 mammal species, including the endangered Bornean orangutan.",
                "The state name 'Sabah' comes from the Arabic word meaning 'morning'."
            ]
        },
        "story": {
            "titles": [
                "Local Legend",
                "Historical Tale",
                "Cultural Story",
                "Adventure Chronicle"
            ],
            "contents": [
                "Legend says Mount Kinabalu is the resting place of spirits of the departed.",
                "The Kadazan-Dusun people have lived in harmony with nature for centuries.",
                "Ancient trade routes connected Sabah to China and the Philippines.",
                "The Murut people were the last tribe in Sabah to give up headhunting.",
                "Sandakan was once known as the 'Little Hong Kong' of North Borneo."
            ]
        },
        "challenge": {
            "titles": [
                "Daily Challenge",
                "Adventure Challenge",
                "Cultural Challenge",
                "Photo Challenge"
            ],
            "contents": [
                "Take a photo with a local and learn one word in their native language.",
                "Find and photograph three different types of tropical flowers.",
                "Try a local dish you've never tasted before.",
                "Visit a location that's not in your original itinerary.",
                "Share your adventure story with someone you meet today."
            ]
        }
    }
    
    template = content_templates.get(content_type, content_templates["tip"])
    
    content_id = f"{content_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}"
    title = random.choice(template["titles"])
    content = random.choice(template["contents"])
    
    # Add location context if provided
    location_context = user_context.get("current_location") if user_context else None
    
    # Determine difficulty based on content type
    difficulty_map = {
        "tip": "Easy",
        "fact": "Easy", 
        "story": "Medium",
        "challenge": "Medium"
    }
    
    tags = [content_type, "ai_generated", "personalized"]
    if location_context:
        tags.append("location_specific")
    
    return DynamicContent(
        content_id=content_id,
        content_type=content_type,
        title=title,
        content=content,
        location_context=location_context,
        difficulty_level=difficulty_map.get(content_type, "Easy"),
        tags=tags,
        generated_at=datetime.now()
    )

def generate_ai_insights(user_behavior: UserBehaviorAnalysis) -> List[AIInsight]:
    """Generate AI-powered insights about user performance and recommendations"""
    insights = []
    
    # Performance insight
    if user_behavior.completion_rate > 0.8:
        insights.append(AIInsight(
            insight_type="performance",
            title="Excellent Progress!",
            description="You're completing quests at an impressive rate. You're clearly engaged and making great progress!",
            actionable_tips=[
                "Consider trying more challenging quests to push your limits",
                "Share your achievements on social media to inspire others",
                "Explore different quest types to broaden your experience"
            ],
            confidence=0.9
        ))
    elif user_behavior.completion_rate < 0.3:
        insights.append(AIInsight(
            insight_type="performance",
            title="Let's Boost Your Adventure!",
            description="It looks like you might be facing some challenges. Let's find ways to make your experience more enjoyable!",
            actionable_tips=[
                "Try easier quests to build confidence and momentum",
                "Focus on quest types you enjoy most",
                "Consider shorter quests that fit better into your schedule"
            ],
            confidence=0.8
        ))
    
    # Recommendation insight
    if len(user_behavior.preferred_quest_types) == 1:
        insights.append(AIInsight(
            insight_type="recommendation",
            title="Expand Your Horizons",
            description=f"You seem to really enjoy {user_behavior.preferred_quest_types[0]} quests. Why not try something new?",
            actionable_tips=[
                "Try a different quest type to discover new interests",
                "Mix easy quests from new categories with your favorites",
                "Join group activities to explore with others"
            ],
            confidence=0.7
        ))
    
    # Achievement prediction
    total_points_estimate = len(user_behavior.preferred_quest_types) * 100 * user_behavior.completion_rate
    if total_points_estimate > 300:
        insights.append(AIInsight(
            insight_type="achievement_prediction",
            title="Achievement Unlock Incoming!",
            description="Based on your progress, you're close to unlocking several new achievements!",
            actionable_tips=[
                "Complete 2 more quests to unlock the 'Explorer' badge",
                "Try a photography quest to unlock 'Shutterbug' achievement",
                "Visit 3 different locations to earn 'Wanderer' status"
            ],
            confidence=0.85
        ))
    
    return insights

# API Endpoints

@router.get("/recommendations/{user_id}", response_model=List[PersonalizedRecommendation])
async def get_personalized_recommendations(user_id: str, limit: int = 5):
    """Get personalized quest recommendations for a user"""
    try:
        # In a real app, fetch user's completed quests from database
        # For demo, using sample data
        sample_completed_quests = [
            {"quest_type": "cultural", "difficulty": "Easy"},
            {"quest_type": "food", "difficulty": "Easy"},
            {"quest_type": "cultural", "difficulty": "Medium"}
        ]
        
        behavior = analyze_user_behavior(user_id, sample_completed_quests)
        user_behaviors[user_id] = behavior
        
        recommendations = generate_personalized_recommendations(behavior, limit)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/content/generate/{content_type}", response_model=DynamicContent)
async def generate_content(content_type: str, user_id: Optional[str] = None, location: Optional[str] = None):
    """Generate dynamic content based on type and context"""
    try:
        if content_type not in ["tip", "fact", "story", "challenge"]:
            raise HTTPException(status_code=400, detail="Invalid content type")
        
        user_context = {}
        if location:
            user_context["current_location"] = location
        
        content = generate_dynamic_content(content_type, user_context)
        generated_content.append(content)
        
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@router.get("/insights/{user_id}", response_model=List[AIInsight])
async def get_ai_insights(user_id: str):
    """Get AI-powered insights for a user"""
    try:
        # Get or create user behavior analysis
        if user_id in user_behaviors:
            behavior = user_behaviors[user_id]
        else:
            # Create default behavior for demo
            behavior = analyze_user_behavior(user_id, [])
            user_behaviors[user_id] = behavior
        
        insights = generate_ai_insights(behavior)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.post("/behavior/update/{user_id}")
async def update_user_behavior(user_id: str, quest_data: Dict[str, Any]):
    """Update user behavior based on quest completion"""
    try:
        # In a real app, this would update the user's behavior profile
        # For demo, we'll just acknowledge the update
        
        if user_id not in user_behaviors:
            user_behaviors[user_id] = analyze_user_behavior(user_id, [])
        
        # Update behavior based on new quest data
        behavior = user_behaviors[user_id]
        
        # Add quest type to preferences if not already there
        quest_type = quest_data.get("quest_type")
        if quest_type and quest_type not in behavior.preferred_quest_types:
            behavior.preferred_quest_types.append(quest_type)
        
        # Update completion rate
        behavior.completion_rate = min(behavior.completion_rate + 0.1, 1.0)
        
        user_behaviors[user_id] = behavior
        
        return {"message": "User behavior updated successfully", "behavior": behavior}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating behavior: {str(e)}")

@router.get("/content/history", response_model=List[DynamicContent])
async def get_generated_content_history(limit: int = 10):
    """Get history of generated content"""
    try:
        # Return most recent content first
        sorted_content = sorted(generated_content, key=lambda x: x.generated_at, reverse=True)
        return sorted_content[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching content history: {str(e)}")

@router.get("/analytics/user-patterns")
async def get_user_patterns():
    """Get analytics about user behavior patterns"""
    try:
        if not user_behaviors:
            return {"message": "No user behavior data available"}
        
        # Analyze patterns across all users
        all_quest_types = []
        all_difficulties = []
        completion_rates = []
        
        for behavior in user_behaviors.values():
            all_quest_types.extend(behavior.preferred_quest_types)
            all_difficulties.append(behavior.difficulty_preference)
            completion_rates.append(behavior.completion_rate)
        
        # Calculate statistics
        quest_type_counts = {qt: all_quest_types.count(qt) for qt in set(all_quest_types)}
        difficulty_counts = {d: all_difficulties.count(d) for d in set(all_difficulties)}
        avg_completion_rate = sum(completion_rates) / len(completion_rates) if completion_rates else 0
        
        return {
            "total_users": len(user_behaviors),
            "popular_quest_types": quest_type_counts,
            "difficulty_distribution": difficulty_counts,
            "average_completion_rate": round(avg_completion_rate, 2),
            "content_generated": len(generated_content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analytics: {str(e)}")