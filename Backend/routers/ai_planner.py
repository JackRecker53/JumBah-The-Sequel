from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from services.ai_planner import AIPlanner

router = APIRouter()
ai_planner = AIPlanner()

class TravelPlanRequest(BaseModel):
    destination: str
    duration: str
    budget: Optional[str] = None
    preferences: Optional[List[str]] = None
    user_id: Optional[str] = "anonymous"

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"
    context: Optional[str] = None

@router.post("/generate-plan")
async def generate_travel_plan(request: TravelPlanRequest):
    """
    Generate a comprehensive travel plan using AI
    
    - **destination**: Travel destination
    - **duration**: Trip duration (e.g., "3 days", "1 week")
    - **budget**: Budget range (optional)
    - **preferences**: List of preferences (optional)
    - **user_id**: User identifier for chat history (optional)
    """
    try:
        result = await ai_planner.generate_travel_plan(
            destination=request.destination,
            duration=request.duration,
            budget=request.budget,
            preferences=request.preferences,
            user_id=request.user_id
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Error generating travel plan: {result.get('error', 'Unknown error')}"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """
    Chat with AI for travel-related questions
    
    - **message**: User message/question
    - **user_id**: User identifier for chat history (optional)
    - **context**: Additional context for the conversation (optional)
    """
    try:
        result = await ai_planner.chat_with_ai(
            message=request.message,
            user_id=request.user_id,
            context=request.context
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Error in AI chat: {result.get('error', 'Unknown error')}"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

@router.get("/history/{user_id}")
async def get_chat_history(
    user_id: str,
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records")
):
    """
    Get chat history for a specific user
    
    - **user_id**: User identifier
    - **limit**: Maximum number of records to return (1-100)
    """
    try:
        result = await ai_planner.get_chat_history(user_id)
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Error retrieving chat history: {result.get('error', 'Unknown error')}"
            )
        
        history = result["history"]
        
        # Apply limit to the history
        if len(history) > limit:
            history = history[-limit:]
        
        return {
            "success": True,
            "history": history,
            "count": len(history),
            "user_id": user_id
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving chat history: {str(e)}"
        )

@router.delete("/history/{user_id}")
async def delete_chat_history(user_id: str):
    """
    Delete all chat history for a specific user
    
    - **user_id**: User identifier whose chat history to delete
    """
    try:
        result = ai_planner.delete_chat_history(user_id)
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Error deleting chat history: {result.get('error', 'Unknown error')}"
            )
        
        return {
            "success": True,
            "message": f"Chat history deleted successfully for user {user_id}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error deleting chat history: {str(e)}"
        )

@router.get("/health")
async def ai_health_check():
    """
    Check if AI service is available
    """
    try:
        # Simple test to check if Gemini API is accessible
        import os
        api_key = os.getenv('GEMINI_API_KEY')
        
        return {
            "status": "healthy",
            "ai_service": "gemini",
            "api_configured": bool(api_key),
            "message": "AI Planner service is operational"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI service unavailable: {str(e)}"
        )