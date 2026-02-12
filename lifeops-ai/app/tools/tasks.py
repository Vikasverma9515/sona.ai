from app.db import supabase


async def create_task(user_id: str, group_id: str, task_text: str, due_at: str = None):
    """
    Create a new task in Supabase.
    """
    data = {
        "user_id": user_id,  # Note: This expects a UUID, so we need to map whatsapp_id to user_id first
        "group_id": group_id,
        "task_text": task_text,
        "due_at": due_at,
        "status": "pending",
    }
    try:
        response = supabase.table("tasks").insert(data).execute()
        return response
    except Exception as e:
        print(f"Error creating task: {e}")
        return None


async def get_tasks(user_id: str):
    """
    Get pending tasks for a user.
    """
    try:
        response = (
            supabase.table("tasks")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "pending")
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Error fetching tasks: {e}")
        return []
