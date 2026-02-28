from app.prompts import SYSTEM_PROMPT
from openai import OpenAI
from app.db import save_memory, get_user_memories, save_group_context, get_group_context
import os

# Initialize Groq client (Groq uses OpenAI-compatible API)
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1"
)


def get_ai_response(user_message: str, system_prompt: str = None) -> str:
    """
    Get AI response from Groq using the provided prompts.
    """
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return "Sorry, I encountered an error processing your message."


async def process_message(
    sender_id: str, message_text: str, group_id: str = None, user_name: str = None
):
    """
    Process incoming messages with intelligent group chat handling and automatic memory.
    """
    print(
        f"Processing message from {sender_id} ({user_name or 'Unknown'}, group: {group_id}): {message_text}"
    )

    # AUTO-SAVE: Save every conversation to memory
    await save_memory(sender_id, f"User said: {message_text}", "conversation")

    # Save group context for memory
    if group_id:
        await save_group_context(group_id, message_text, sender_id)

    # GROUP CHAT LOGIC: Only respond when mentioned or when we should help
    if group_id:
        is_mentioned = "sona" in message_text.lower() or "@sona" in message_text.lower()

        # Check if this is something Sona should respond to even without mention
        should_respond_anyway = _should_respond_to_group_message(message_text)

        if not is_mentioned and not should_respond_anyway:
            print("Ignoring group message (not mentioned and not relevant)")
            return None  # Don't reply to every group message

        # Remove mention from message for cleaner processing
        message_text = message_text.replace("@sona", "").replace("sona", "", 1).strip()
        if message_text.startswith(",") or message_text.startswith(":"):
            message_text = message_text[1:].strip()

    # Check for specific intents
    msg_lower = message_text.lower()

    # Summary intent
    if "summary" in msg_lower or "summarize" in msg_lower:
        return "sure, let me summarize this chat for you"

    # Task/reminder intent
    if any(word in msg_lower for word in ["remind", "task", "todo", "due", "deadline"]):
        return "noted! I'll keep track of that for you"

    # Calendar intent
    if "schedule" in msg_lower or "calendar" in msg_lower or "meeting" in msg_lower:
        return "checking your calendar... 📅"

    # MEMORY RETRIEVAL: Get conversation history
    memories = await get_user_memories(sender_id, limit=10)
    context_str = ""

    if memories:
        print(f"[MEMORY] Found {len(memories)} memories")
        context_str = "\n\nPrevious conversation context:\n"
        for mem in memories:
            context_str += f"- {mem['content']}\n"

    # Build enhanced prompt with memory
    enhanced_prompt = SYSTEM_PROMPT
    if context_str:
        enhanced_prompt += context_str

    # Get AI response with full context
    ai_response = get_ai_response(message_text, enhanced_prompt)

    # AUTO-SAVE: Save Sona's response too
    await save_memory(sender_id, f"Sona replied: {ai_response}", "conversation")

    return ai_response


def _should_respond_to_group_message(message: str) -> bool:
    """
    Determine if Sona should respond to a group message even without being mentioned.
    Returns True for questions about tasks, scheduling, or when help seems needed.
    """
    msg_lower = message.lower()

    # Respond to direct questions
    if message.startswith("?") or any(
        msg_lower.startswith(q)
        for q in ["what", "when", "who", "where", "how", "can someone"]
    ):
        return True

    # Respond to task/coordination keywords
    help_keywords = [
        "deadline",
        "due date",
        "meeting",
        "schedule",
        "task",
        "remind",
        "todo",
        "who's doing",
        "who can",
        "need help",
    ]

    if any(keyword in msg_lower for keyword in help_keywords):
        return True

    return False
