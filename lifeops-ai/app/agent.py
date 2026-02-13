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

    # 1. Retrieve user's memories
    # In a real app, we'd query Supabase here:
    # memories = supabase.table("memories").select("content").eq("user_id", sender_id).execute()
    # For now, we'll mock it or just print it.
    print(f"Retrieving memories for {sender_id}...")

    # 2. Check for "Remember" intent
    if "remember" in message_text.lower():
        # memory_content = message_text.replace("remember", "").strip()
        # await supabase.table("memories").insert({"user_id": sender_id, "content": memory_content}).execute()
        return f"Got it! I'll remember that: {message_text}"

    if "summary" in message_text.lower():
        # Trigger summarization logic
        return "Noted. I'll summarize the chat shortly."

    if "remind" in message_text.lower() or "due" in message_text.lower():
        # Trigger task extraction
        # completion = await openai.ChatCompletion.acreate(...)
        return "I've noted that task."

    # 3. Check for specific tool usage (Calendar, Jira)
    if "schedule" in message_text.lower() or "calendar" in message_text.lower():
        # Instantiate tool with user context
        from app.tools.calendar import CalendarTool

        calendar = CalendarTool(user_id=sender_id)

        # Check specific intent (list vs create)
        if "what" in message_text.lower() or "list" in message_text.lower():
            events = await calendar.list_events()
            return events

        # Default to create/check availability mock
        # In real world, we'd parse time from message_text
        return "Checking your calendar... 📅 You are free at that time. detailed invite sent."

    if "jira" in message_text.lower() or "bug" in message_text.lower():
        return "I've logged that bug to Jira. Ticket [PROJ-204] created. 🐛"

    # Default response
    # return "Received: " + message_text
    return None  # Don't reply to everything in groups
