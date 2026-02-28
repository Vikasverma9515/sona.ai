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
    print(f"Received webhook: {body}")  # Debug log

    try:
        if body.get("object") == "whatsapp_business_account":
            for entry in body.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    if "messages" in value:
                        # Extract user profile name from contacts if available
                        user_name = None
                        contacts = value.get("contacts", [])
                        if contacts and len(contacts) > 0:
                            profile = contacts[0].get("profile", {})
                            user_name = profile.get("name")

                        for message in value.get("messages", []):
                            if message.get("type") == "text":
                                sender_id = message.get("from")
                                message_text = message.get("text", {}).get("body")

                                # Save user name to memory if we have it
                                if user_name:
                                    from app.db import save_memory

                                    await save_memory(
                                        sender_id,
                                        f"User's name is {user_name}",
                                        "profile",
                                    )

                                # Extract group information if present
                                group_id = None
                                context = message.get("context", {})

                                # Check if message is from a group
                                # WhatsApp Business API provides group info in metadata
                                metadata = value.get("metadata", {})
                                display_phone = metadata.get("display_phone_number")

                                # If there's a group_id in the context, it's a group chat
                                if context.get("group_jid"):
                                    group_id = context.get("group_jid")

                                print(
                                    f"Processing message from {sender_id} (group: {group_id}): {message_text}"
                                )

                                # Process message and get AI response
                                response_text = await process_message(
                                    sender_id, message_text, group_id, user_name
                                )

                                if response_text:
                                    # Send reply back to WhatsApp
                                    await send_whatsapp_message(
                                        sender_id, response_text
                                    )

        return {"status": "success"}
    except Exception as e:
        print(f"Error processing webhook: {e}")
        import traceback

        traceback.print_exc()
        return {"status": "error", "message": str(e)}


async def send_whatsapp_message(to: str, message: str):
    """
    Send a message to WhatsApp user using the WhatsApp Business API.
    """
    import httpx

    WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN")
    PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")  # You'll need to add this

    if not WHATSAPP_API_TOKEN or not PHONE_NUMBER_ID:
        print("Missing WhatsApp API credentials")
        return

    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"

    headers = {
        "Authorization": f"Bearer {WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json",
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "text": {"body": message},
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            print(f"Message sent successfully to {to}")
        except Exception as e:
            print(f"Error sending WhatsApp message: {e}")
            print(
                f"Response: {response.text if 'response' in locals() else 'No response'}"
            )
