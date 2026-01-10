from fastapi import FastAPI, APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import logging
from datetime import datetime, timezone
import uuid

# Load environment variables
load_dotenv()

# Create the main app
app = FastAPI(
    title="Like Follow Social Media API",
    description="Backend API for social media content generation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# API Router
api_router = APIRouter(prefix="/api")

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str = "Backend is running"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GenerateContentRequest(BaseModel):
    content_type: str  # e.g., "caption", "hashtag", "bio"
    platform: str
    description: str
    tone: Optional[str] = "engaging"

class GeneratedContentResponse(BaseModel):
    result: str
    character_count: int
    platform_limit: Optional[int] = None

# Routes
@api_router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Like Follow Social Media Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@api_router.get("/status", response_model=StatusCheck)
async def status():
    """Check backend status"""
    return StatusCheck()

@api_router.post("/generate-content", response_model=GeneratedContentResponse)
async def generate_content(request: GenerateContentRequest):
    """Generate social media content"""
    try:
        # TODO: Integrate with AI/LLM service (Gemini, Claude, etc.)
        result = f"Generated {request.content_type} for {request.platform}"
        
        return GeneratedContentResponse(
            result=result,
            character_count=len(result),
            platform_limit=2200  # Example limit
        )
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to generate content"}
        )

# Include router
app.include_router(api_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True)
