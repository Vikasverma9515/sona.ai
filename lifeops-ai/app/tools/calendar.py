from datetime import datetime, timedelta
import httpx
from app.db import supabase


class CalendarTool:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.token = self._get_access_token()

    def _get_access_token(self):
        # 1. Get tokens from Supabase
        response = (
            supabase.table("users")
            .select("google_tokens")
            .eq("whatsapp_id", self.user_id)
            .execute()
        )
        if not response.data or not response.data[0].get("google_tokens"):
            return None

        tokens = response.data[0]["google_tokens"]
        # In a real app, check expiry and refresh if needed using refresh_token
        return tokens.get("access_token")

    async def list_events(self):
        if not self.token:
            return "Please connect your Google Calendar first."

        headers = {"Authorization": f"Bearer {self.token}"}
        # Get events for next 7 days
        time_min = datetime.utcnow().isoformat() + "Z"
        time_max = (datetime.utcnow() + timedelta(days=7)).isoformat() + "Z"

        url = f"https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin={time_min}&timeMax={time_max}&singleEvents=true&orderBy=startTime"

        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return "Failed to fetch events."

            events = resp.json().get("items", [])
            if not events:
                return "No upcoming events found."

            summary = "Here are your upcoming events:\n"
            for event in events[:5]:  # Limit to 5
                start = event["start"].get("dateTime", event["start"].get("date"))
                summary += f"- {event['summary']} at {start}\n"
            return summary

    async def create_event(self, summary: str, start_time: str):
        """
        Simple event creation.
        start_time should be ISO format or relative "tomorrow at 2pm" (would need parsing).
        For this MVP, assuming ISO or handling simple cases in Agent.
        """
        if not self.token:
            return "Please connect your Google Calendar first."

        # Mocking creation for now to avoid accidental spam if not fully configured with valid times
        # Real implementation would POST to /events
        return f"✅ Scheduled '{summary}' at {start_time} (Mocked)"
