import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key) if url and key else None


async def save_memory(user_id: str, content: str, memory_type: str = "general"):
    """
    Save a memory/context for a user.
    """
    print(
        f"[DEBUG] save_memory called: user_id={user_id}, content='{content}', type={memory_type}"
    )

    if not supabase:
        print("[ERROR] Supabase not configured - check .env file!")
        return None

    try:
        result = (
            supabase.table("memories")
            .insert(
                {
                    "user_id": user_id,
                    "content": content,
                    "memory_type": memory_type,
                    "created_at": datetime.utcnow().isoformat(),
                }
            )
            .execute()
        )
        print(f"[SUCCESS] Memory saved to database!")
        return result
    except Exception as e:
        print(f"[ERROR] Error saving memory: {e}")
        import traceback

        traceback.print_exc()
        return None


async def get_user_memories(user_id: str, limit: int = 10):
    """
    Retrieve recent memories for a user.
    """
    if not supabase:
        print("Supabase not configured")
        return []

    try:
        result = (
            supabase.table("memories")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data if result.data else []
    except Exception as e:
        print(f"Error retrieving memories: {e}")
        return []


async def save_group_context(group_id: str, message: str, sender_id: str):
    """
    Save group conversation context for later retrieval.
    """
    print(f"[DEBUG] save_group_context called: group_id={group_id}, sender={sender_id}")

    if not supabase:
        print("[ERROR] Supabase not configured")
        return None

    try:
        result = (
            supabase.table("group_messages")
            .insert(
                {
                    "group_id": group_id,
                    "sender_id": sender_id,
                    "message": message,
                    "created_at": datetime.utcnow().isoformat(),
                }
            )
            .execute()
        )
        print(f"[SUCCESS] Group context saved!")
        return result
    except Exception as e:
        print(f"[ERROR] Error saving group context: {e}")
        import traceback

        traceback.print_exc()
        return None


async def get_group_context(group_id: str, limit: int = 20):
    """
    Retrieve recent group conversation context.
    """
    if not supabase:
        print("Supabase not configured")
        return []

    try:
        result = (
            supabase.table("group_messages")
            .select("*")
            .eq("group_id", group_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data if result.data else []
    except Exception as e:
        print(f"Error retrieving group context: {e}")
        return []
