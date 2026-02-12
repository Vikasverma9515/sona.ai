from app.prompts import SYSTEM_PROMPT, TASK_EXTRACTION_PROMPT
import openai
import os
import json

openai.api_key = os.getenv("OPENAI_API_KEY")


async def process_message(sender_id: str, message_text: str, group_id: str = None):
    """
    Core function to process incoming GitHub messages.
    1. Identify intent (Task, Summary, Query).
    2. Call LLM.
    3. Perform action (Save task, Reply).
    """
    print(f"Processing message from {sender_id}: {message_text}")

    # Placeholder logic for MVP
    # In a real implementation, we would use function calling or a router here.

    if "summary" in message_text.lower():
        # Trigger summarization logic
        return "Noted. I'll summarize the chat shortly."

    if "remind" in message_text.lower() or "due" in message_text.lower():
        # Trigger task extraction
        # completion = await openai.ChatCompletion.acreate(...)
        return "I've noted that task."

    # Default response
    # return "Received: " + message_text
    return None  # Don't reply to everything in groups
