"""
Copyright (c) 2026 Winplaybox
All rights reserved.

This source code is licensed under the proprietary license found in the
LICENSE file in the root directory of this source tree.
Unauthorized copying of this file, via any medium, is strictly prohibited.

Proprietary and confidential.
"""
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
import json

# Load environment variables
load_dotenv()

# Parse platforms and tones from .env
PLATFORMS = json.loads(os.environ.get('EXPO_PUBLIC_PLATFORMS', '[]'))
TONES = json.loads(os.environ.get('EXPO_PUBLIC_TONES', '[]'))
DEFAULT_PLATFORM = os.environ.get('EXPO_PUBLIC_DEFAULT_PLATFORM', 'instagram')
DEFAULT_TONE = os.environ.get('EXPO_PUBLIC_DEFAULT_TONE', 'engaging')
SUPPORTED_MODELS = json.loads(os.environ.get('EXPO_AI_MODELS', '[]'))

# API keys for each model (env var names should match model keys)
MODEL_API_KEYS = {m['key']: os.environ.get(f"{m['key'].upper()}_API_KEY") for m in SUPPORTED_MODELS}
DEFAULT_MODEL_KEY = SUPPORTED_MODELS[0]['key'] if SUPPORTED_MODELS else 'gemini'

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
    platform: Optional[str] = None
    description: str
    tone: Optional[str] = None
    model: Optional[str] = None  # Model key, e.g. 'gemini', 'openai', ...
    api_key: Optional[str] = None  # User-supplied API key (optional)

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
    """Generate social media content (supports multiple models)"""
    try:
        platform = request.platform or DEFAULT_PLATFORM
        tone = request.tone or DEFAULT_TONE
        model_key = (request.model or DEFAULT_MODEL_KEY).lower()
        model_info = next((m for m in SUPPORTED_MODELS if m['key'] == model_key), None)
        if not model_info:
            return JSONResponse(status_code=400, content={"error": "Invalid model"})

        # API key: user-supplied or from env
        api_key = request.api_key or MODEL_API_KEYS.get(model_key)

        # Validate platform
        platform_info = next((p for p in PLATFORMS if p['value'] == platform), None)
        if not platform_info:
            return JSONResponse(status_code=400, content={"error": "Invalid platform"})

        # Validate tone
        tone_info = next((t for t in TONES if t['value'] == tone), None)
        if not tone_info:
            return JSONResponse(status_code=400, content={"error": "Invalid tone"})

        if not api_key:
            return JSONResponse(status_code=400, content={"error": f"{model_info['label']} API key required"})

        # Placeholder for model-specific API integration
        def call_model_service(api_key, prompt, model_key):
            usage_exceeded = False  # Simulate usage check
            if usage_exceeded:
                return None, True
            return f"AI-generated {prompt} for {platform} using {model_info['label']} (tone: {tone})", False

        prompt = f"{request.content_type}: {request.description}"
        result, usage_exceeded = call_model_service(api_key, prompt, model_key)

        if usage_exceeded:
            return JSONResponse(
                status_code=402,
                content={
                    "error": f"API key usage exceeded. Please provide your own {model_info['label']} API key to continue."
                }
            )

        char_limit = platform_info.get('characterLimit', 2200)
        return GeneratedContentResponse(
            result=result,
            character_count=len(result),
            platform_limit=char_limit
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
