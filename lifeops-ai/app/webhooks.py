from fastapi import APIRouter, Request, HTTPException, Query
from app.agent import process_message
import os
import json

router = APIRouter()

VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")


@router.get("/webhook")
async def verify_webhook(
    mode: str = Query(..., alias="hub.mode"),
    token: str = Query(..., alias="hub.verify_token"),
    challenge: str = Query(..., alias="hub.challenge"),
):
    """
    Handle WhatsApp Webhook verification challenge.
    """
    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("Webhook verified successfully!")
        return int(challenge)

    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhook")
async def handle_message(request: Request):
    """
    Handle incoming messages from WhatsApp.
    """
    body = await request.json()

    try:
        if body.get("object") == "whatsapp_business_account":
            for entry in body.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    if "messages" in value:
                        for message in value.get("messages", []):
                            if message.get("type") == "text":
                                sender_id = message.get("from")
                                message_text = message.get("text", {}).get("body")

                                # Process message asynchronously
                                # In production, push to a queue (Celery/Redis)
                                await process_message(sender_id, message_text)

        return {"status": "success"}
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return {"status": "error", "message": str(e)}
