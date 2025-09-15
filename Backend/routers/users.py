from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from datetime import datetime
import uuid

router = APIRouter()

# Data models
class Achievement(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    category: str
    unlocked: bool = False
    unlocked_date: Optional[datetime] = None

class UserProfile(BaseModel):
    user_id: str
    username: str
    email: Optional[str] = None
    total_quests_completed: int = 0
    total_points: int = 0
    level: int = 1
    achievements: List[Achievement] = []
    unlocked_content: List[str] = []
    created_date: datetime
    last_active: datetime

class QuestCompletion(BaseModel):
    quest_id: str
    quest_type: str
    location: str
    points_earned: int
    completion_date: datetime

class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    total_points: int
    level: int
    rank: int

# In-memory storage (in production, use a proper database)
users_data = {}
leaderboard_data = []

# Achievement definitions
ACHIEVEMENTS = [
    {"id": "first_quest", "name": "First Steps", "description": "Complete your first quest", "icon": "🎯", "category": "beginner"},
    {"id": "photo_master", "name": "Photo Master", "description": "Complete 5 photo quests", "icon": "📸", "category": "photo"},
    {"id": "trivia_expert", "name": "Trivia Expert", "description": "Answer 10 trivia questions correctly", "icon": "🧠", "category": "trivia"},
    {"id": "explorer", "name": "Explorer", "description": "Visit 10 different locations", "icon": "🗺️", "category": "exploration"},
    {"id": "culture_enthusiast", "name": "Culture Enthusiast", "description": "Complete all cultural quests", "icon": "🏛️", "category": "culture"},
    {"id": "foodie", "name": "Foodie", "description": "Complete all food-related quests", "icon": "🍜", "category": "food"},
    {"id": "speed_runner", "name": "Speed Runner", "description": "Complete 5 quests in one day", "icon": "⚡", "category": "speed"},
    {"id": "completionist", "name": "Completionist", "description": "Complete all available quests", "icon": "👑", "category": "completion"}
]

@router.post("/profile", response_model=UserProfile)
async def create_user_profile(username: str, email: Optional[str] = None):
    """Create a new user profile"""
    user_id = str(uuid.uuid4())
    
    # Initialize achievements
    user_achievements = [
        Achievement(
            id=ach["id"],
            name=ach["name"],
            description=ach["description"],
            icon=ach["icon"],
            category=ach["category"],
            unlocked=False
        ) for ach in ACHIEVEMENTS
    ]
    
    profile = UserProfile(
        user_id=user_id,
        username=username,
        email=email,
        achievements=user_achievements,
        created_date=datetime.now(),
        last_active=datetime.now()
    )
    
    users_data[user_id] = profile.dict()
    return profile

@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    """Get user profile by ID"""
    if user_id not in users_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile_data = users_data[user_id]
    profile_data["last_active"] = datetime.now()
    users_data[user_id] = profile_data
    
    return UserProfile(**profile_data)

@router.post("/profile/{user_id}/quest-completion")
async def record_quest_completion(user_id: str, completion: QuestCompletion):
    """Record a quest completion and update user progress"""
    if user_id not in users_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile_data = users_data[user_id]
    profile_data["total_quests_completed"] += 1
    profile_data["total_points"] += completion.points_earned
    
    # Level up logic (every 100 points = 1 level)
    new_level = (profile_data["total_points"] // 100) + 1
    if new_level > profile_data["level"]:
        profile_data["level"] = new_level
    
    # Check for achievement unlocks
    achievements = profile_data["achievements"]
    for achievement in achievements:
        if not achievement["unlocked"]:
            if check_achievement_unlock(achievement["id"], profile_data, completion):
                achievement["unlocked"] = True
                achievement["unlocked_date"] = datetime.now().isoformat()
    
    profile_data["last_active"] = datetime.now().isoformat()
    users_data[user_id] = profile_data
    
    # Update leaderboard
    update_leaderboard(user_id, profile_data)
    
    return {"message": "Quest completion recorded", "new_level": profile_data["level"]}

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 10):
    """Get the top players leaderboard"""
    # Sort by total points descending
    sorted_leaderboard = sorted(leaderboard_data, key=lambda x: x["total_points"], reverse=True)
    
    # Add ranks
    for i, entry in enumerate(sorted_leaderboard[:limit]):
        entry["rank"] = i + 1
    
    return [LeaderboardEntry(**entry) for entry in sorted_leaderboard[:limit]]

@router.get("/achievements", response_model=List[Achievement])
async def get_all_achievements():
    """Get all available achievements"""
    return [Achievement(**ach, unlocked=False) for ach in ACHIEVEMENTS]

@router.post("/profile/{user_id}/unlock-content")
async def unlock_content(user_id: str, content_id: str):
    """Unlock content for a user"""
    if user_id not in users_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile_data = users_data[user_id]
    if content_id not in profile_data["unlocked_content"]:
        profile_data["unlocked_content"].append(content_id)
        users_data[user_id] = profile_data
    
    return {"message": "Content unlocked", "content_id": content_id}

def check_achievement_unlock(achievement_id: str, profile_data: dict, completion: QuestCompletion) -> bool:
    """Check if an achievement should be unlocked"""
    if achievement_id == "first_quest" and profile_data["total_quests_completed"] == 1:
        return True
    elif achievement_id == "photo_master":
        # Count photo quests (this would need quest history in real implementation)
        return profile_data["total_quests_completed"] >= 5
    elif achievement_id == "trivia_expert":
        # Count trivia quests
        return profile_data["total_quests_completed"] >= 10
    elif achievement_id == "explorer":
        # Count unique locations
        return profile_data["total_quests_completed"] >= 10
    elif achievement_id == "completionist":
        # All quests completed (assuming 20 total quests)
        return profile_data["total_quests_completed"] >= 20
    
    return False

def update_leaderboard(user_id: str, profile_data: dict):
    """Update the leaderboard with user data"""
    # Remove existing entry if present
    global leaderboard_data
    leaderboard_data = [entry for entry in leaderboard_data if entry["user_id"] != user_id]
    
    # Add updated entry
    leaderboard_data.append({
        "user_id": user_id,
        "username": profile_data["username"],
        "total_points": profile_data["total_points"],
        "level": profile_data["level"],
        "rank": 0  # Will be calculated when fetching
    })