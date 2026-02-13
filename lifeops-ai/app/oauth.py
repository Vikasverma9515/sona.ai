import os
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
import httpx
from app.db import supabase

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# In production, this should be your actual domain
REDIRECT_URI = "http://localhost:8000/auth/callback"
AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"


@router.get("/auth/google")
async def login_google(user_id: str):
    """
    Redirects the user to Google's OAuth 2.0 consent screen.
    We pass the user_id as state to know who to link the token to.
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")

    scope = "https://www.googleapis.com/auth/calendar.events"

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": scope,
        "access_type": "offline",  # Important for refresh tokens
        "prompt": "consent",  # Force consent to ensure we get a refresh token
        "state": user_id,
    }

    url = httpx.URL(AUTHORIZATION_URL).copy_with(params=params)
    return RedirectResponse(str(url))


@router.get("/auth/callback")
async def auth_callback(code: str, state: str):
    """
    Exchanges the authorization code for an access token and refresh token.
    """
    if not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500, detail="Google Client Secret not configured"
        )

    async with httpx.AsyncClient() as client:
        response = await client.post(
            TOKEN_URL,
            data={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": REDIRECT_URI,
            },
        )

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to retrieve token")

        tokens = response.json()

        # Store tokens in Supabase for the user (state = user_id)
        # We only strictly need refresh_token for long-term access, but storing all for now
        user_id = state

        # Update user record
        try:
            supabase.table("users").update({"google_tokens": tokens}).eq(
                "whatsapp_id", user_id
            ).execute()
        except Exception as e:
            # If user doesn't exist/error, logs it. In real app, handle user creation/error better.
            print(f"Error saving tokens: {e}")

        return {
            "message": "Google Calendar connected successfully! You can close this window."
        }
